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

export default function EmployeesManagementPage() {
  const { activeBusiness } = useAuthStore();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);

  // Fetch employees data
  const { data, isLoading } = useQuery({
    queryKey: ['employees', activeBusiness?.id],
    queryFn: async () => {
      if (!activeBusiness?.id) return { data: [], total: 0 };
      const res = await api.get(`/businesses/${activeBusiness.id}/data/employees?limit=100`);
      return res.data.data;
    },
    enabled: !!activeBusiness?.id,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await api.post(`/import/${activeBusiness?.id}/employees`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Employees data uploaded successfully!');
      setShowUpload(false);
      queryClient.invalidateQueries({ queryKey: ['employees', activeBusiness?.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload employees data');
    },
  });

  // Table Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'department',
      header: 'Department',
    },
    {
      accessorKey: 'designation',
      header: 'Designation',
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('salary'));
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: activeBusiness?.currency || 'INR',
        }).format(amount);
      },
    },
    {
      accessorKey: 'joiningDate',
      header: 'Joining Date',
      cell: ({ row }) => {
        const date = row.getValue('joiningDate') as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20' : 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    }
  ];

  const employees = data?.data || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Employees Data</h1>
          <p className="text-[#A1A1AA] mt-1">Manage your business workforce and payroll records.</p>
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
            Add Employee
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="bg-[#171719] border border-[#2A2A2D] rounded-xl p-6">
          <h2 className="text-lg font-medium text-white mb-4">Import Employees Data (CSV)</h2>
          <FileUpload 
            onUpload={(file) => uploadMutation.mutate(file)} 
            isLoading={uploadMutation.isPending} 
          />
        </div>
      )}

      <DataTable 
        columns={columns} 
        data={employees} 
        searchKey="name" 
        loading={isLoading} 
      />
    </div>
  );
}
