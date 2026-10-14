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

export default function SalesManagementPage() {
  const { activeBusiness } = useAuthStore();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);

  // Fetch sales data
  const { data, isLoading } = useQuery({
    queryKey: ['sales', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return { data: [], total: 0 };
      const res = await api.get(`/businesses/${activeBusiness.id}/data/sales?limit=100`);
      return res.data.data; // assuming { success: true, data: { data: [...], total: ... } }
    },
    enabled: !!activeBusiness?.id,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post(`/import/${activeBusiness?.id}/sales`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Sales data uploaded successfully!');
      setShowUpload(false);
      queryClient.invalidateQueries({ queryKey: ['sales', activeBusiness?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload sales data');
    },
  });

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = row.getValue('date') as string;
        // fallback to standard JS date parsing if date-fns is not available yet
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => {
        const product = row.getValue('product') as any;
        return product ? product.name : 'Unknown';
      },
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
    },
    {
      accessorKey: 'unitPrice',
      header: 'Unit Price',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('unitPrice'));
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: activeBusiness?.currency || 'INR',
        }).format(amount);
      },
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalAmount'));
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: activeBusiness?.currency || 'INR',
        }).format(amount);
      },
    },
  ];

  const sales = data?.data || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Sales Data</h1>
          <p className="text-[#A1A1AA] mt-1">Manage and analyze your business sales records.</p>
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
            Add Sale
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="bg-[#171719] border border-[#2A2A2D] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Import Sales Data (CSV)</h2>
          <FileUpload 
            onUpload={(file) => uploadMutation.mutate(file)} 
            isLoading={uploadMutation.isPending} 
          />
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={sales} 
        searchKey="product" 
        loading={isLoading} 
      />
    </div>
  );
}
