'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import api from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import { DataTable } from '@/components/ui/data-table';
import { FileUpload } from '@/components/ui/file-upload';
import Button from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExpensesManagementPage() {
  const { activeBusiness } = useAuthStore();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);

  // Fetch expenses data
  const { data, isLoading } = useQuery({
    queryKey: ['expenses', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return { data: [], total: 0 };
      const res = await api.get(`/businesses/${activeBusiness.id}/data/expenses?limit=100`);
      return res.data.data;
    },
    enabled: !!activeBusiness?.id,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post(`/import/${activeBusiness?.id}/expenses`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Expenses data uploaded successfully!');
      setShowUpload(false);
      queryClient.invalidateQueries({ queryKey: ['expenses', activeBusiness?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload expenses data');
    },
  });

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: activeBusiness?.currency || 'INR',
        }).format(amount);
      },
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
    },
  ];

  const expenses = data?.data || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Expenses Data</h1>
          <p className="text-[#A1A1AA] mt-1">Manage and analyze your business expense records.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setShowUpload(!showUpload)}
            className="border-[#2A2A2D] text-[#F5F5F5] hover:bg-white/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="bg-[#171719] border border-[#2A2A2D] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Import Expenses Data (CSV)</h2>
          <FileUpload 
            onUpload={(file) => uploadMutation.mutate(file)} 
            isLoading={uploadMutation.isPending} 
          />
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={expenses} 
        searchKey="category" 
        loading={isLoading} 
      />
    </div>
  );
}
