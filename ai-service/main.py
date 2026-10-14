from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
from prophet import Prophet
from sklearn.ensemble import IsolationForest
import numpy as np
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="BusinessPulse AI Service", version="1.0.0")

class TimeSeriesPoint(BaseModel):
    date: str # YYYY-MM-DD
    value: float

class ForecastRequest(BaseModel):
    historical_data: List[TimeSeriesPoint]
    periods: int = 12
    freq: str = "ME" # Month End

class ForecastResponsePoint(BaseModel):
    date: str
    predicted_value: float
    lower_bound: float
    upper_bound: float

class ForecastResponse(BaseModel):
    forecast: List[ForecastResponsePoint]

class AnomalyRequest(BaseModel):
    historical_data: List[TimeSeriesPoint]
    contamination: float = 0.1 # Expected proportion of anomalies

class AnomalyResponsePoint(BaseModel):
    date: str
    value: float
    is_anomaly: bool
    score: float # Anomaly score (-1 to 1, lower is more anomalous)

class AnomalyResponse(BaseModel):
    anomalies: List[AnomalyResponsePoint]

class SimulationRequest(BaseModel):
    decision_type: str
    parameters: Dict[str, Any]
    current_monthly_revenue: float
    current_monthly_expense: float

class MonthlyImpact(BaseModel):
    month: int
    revenue_change: float
    expense_change: float
    profit_change: float

class SimulationResponse(BaseModel):
    impacts: List[MonthlyImpact]
    break_even_month: Optional[int]
    risk_score: int
    risk_factors: List[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai-service"}

@app.post("/forecast/prophet", response_model=ForecastResponse)
def generate_prophet_forecast(request: ForecastRequest):
    if len(request.historical_data) < 3:
        raise HTTPException(status_code=400, detail="Not enough historical data for forecasting. Need at least 3 periods.")
    
    # Convert to pandas dataframe format required by Prophet
    df = pd.DataFrame([{"ds": p.date, "y": p.value} for p in request.historical_data])
    df['ds'] = pd.to_datetime(df['ds'])
    
    try:
        # Initialize and fit the model
        model = Prophet(yearly_seasonality=True, weekly_seasonality=False, daily_seasonality=False)
        model.fit(df)
        
        # Create future dataframe
        future = model.make_future_dataframe(periods=request.periods, freq=request.freq)
        
        # Predict
        forecast = model.predict(future)
        
        # Filter only future predictions
        last_historical_date = df['ds'].max()
        future_forecast = forecast[forecast['ds'] > last_historical_date]
        
        response_data = []
        for _, row in future_forecast.iterrows():
            response_data.append(ForecastResponsePoint(
                date=row['ds'].strftime('%Y-%m-%d'),
                predicted_value=max(0, row['yhat']), # Don't predict negative revenue/expenses
                lower_bound=max(0, row['yhat_lower']),
                upper_bound=max(0, row['yhat_upper'])
            ))
            
        return ForecastResponse(forecast=response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting error: {str(e)}")

@app.post("/anomalies/detect", response_model=AnomalyResponse)
def detect_anomalies(request: AnomalyRequest):
    if len(request.historical_data) < 5:
        raise HTTPException(status_code=400, detail="Not enough data. Need at least 5 periods for anomaly detection.")
    
    df = pd.DataFrame([{"date": p.date, "value": p.value} for p in request.historical_data])
    
    try:
        # Prepare data
        X = df[['value']].values
        
        # Fit Isolation Forest
        model = IsolationForest(contamination=request.contamination, random_state=42)
        model.fit(X)
        
        # Predict (-1 is anomaly, 1 is normal)
        predictions = model.predict(X)
        scores = model.decision_function(X) # lower score -> more anomalous
        
        response_data = []
        for i, row in df.iterrows():
            response_data.append(AnomalyResponsePoint(
                date=row['date'],
                value=row['value'],
                is_anomaly=bool(predictions[i] == -1),
                score=float(scores[i])
            ))
            
        return AnomalyResponse(anomalies=response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly detection error: {str(e)}")

@app.post("/simulate/decision", response_model=SimulationResponse)
def simulate_decision(request: SimulationRequest):
    impacts = []
    total_cost = 0
    total_new_revenue = 0
    break_even_month = None
    
    # 1. Calculate Monthly Impacts based on heuristics
    for month in range(1, 13): # 12 month simulation
        rev_change = 0.0
        exp_change = 0.0
        
        if request.decision_type == "HIRING":
            count = request.parameters.get("count", 1)
            monthly_cost = request.parameters.get("monthlyCostPerHire", 5000)
            offset = request.parameters.get("startMonthOffset", 1)
            if month >= offset:
                exp_change += (count * monthly_cost)
            # Assume revenue impact starts 3 months after hire
            if month >= offset + 3:
                rev_change += (count * monthly_cost * 1.5) # Assume 1.5x ROI on salary
                
        elif request.decision_type == "NEW_STORE":
            capex = request.parameters.get("upfrontCapex", 50000)
            opex = request.parameters.get("monthlyOpex", 10000)
            target_rev = request.parameters.get("expectedMonthlyRevenue", 25000)
            offset = request.parameters.get("startMonthOffset", 1)
            
            if month == offset:
                exp_change += capex + opex
            elif month > offset:
                exp_change += opex
                
            # Phased revenue growth
            if month == offset + 1:
                rev_change += target_rev * 0.3
            elif month == offset + 2:
                rev_change += target_rev * 0.6
            elif month > offset + 2:
                rev_change += target_rev
                
        elif request.decision_type == "MARKETING":
            upfront = request.parameters.get("upfrontCost", 10000)
            duration = request.parameters.get("durationMonths", 3)
            roas = request.parameters.get("expectedRoas", 3.0)
            
            if month <= duration:
                monthly_ad_spend = upfront / duration
                exp_change += monthly_ad_spend
                rev_change += (monthly_ad_spend * roas)
                
        # Calculate profit change
        profit_change = rev_change - exp_change
        
        impacts.append(MonthlyImpact(
            month=month,
            revenue_change=rev_change,
            expense_change=exp_change,
            profit_change=profit_change
        ))
        
        total_cost += exp_change
        total_new_revenue += rev_change
        
        # Check Break Even
        if break_even_month is None and total_new_revenue >= total_cost and total_cost > 0:
            break_even_month = month

    # 2. Risk Engine (0-100)
    risk_score = 0
    risk_factors = []
    
    # Calculate worst case upfront cost (month 1-3 total negative profit)
    initial_burn = sum([abs(i.profit_change) for i in impacts if i.profit_change < 0])
    
    # If initial burn is > 30% of current cashflow (using current revenue as proxy)
    proxy_cashflow = request.current_monthly_revenue * 0.2 # assume 20% margin
    if proxy_cashflow <= 0:
        risk_score += 80
        risk_factors.append("Current cashflow is negative or zero.")
    else:
        burn_ratio = initial_burn / proxy_cashflow
        if burn_ratio > 3: # Burn > 3 months of cashflow
            risk_score += 50
            risk_factors.append("High upfront cost relative to monthly cash flow.")
        elif burn_ratio > 1:
            risk_score += 30
            risk_factors.append("Moderate upfront investment required.")
            
    if break_even_month is None:
        risk_score += 40
        risk_factors.append("Decision does not break even within 12 months.")
    elif break_even_month > 6:
        risk_score += 20
        risk_factors.append(f"Long payback period ({break_even_month} months).")
        
    risk_score = min(100, risk_score)
    
    return SimulationResponse(
        impacts=impacts,
        break_even_month=break_even_month,
        risk_score=risk_score,
        risk_factors=risk_factors
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
