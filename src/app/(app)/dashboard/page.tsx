
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Users } from "lucide-react";
import { useCandidates } from "@/contexts/candidate-context";
import { AddCandidateForm } from "@/components/dashboard/add-candidate-form";
import { CandidateStatusBadge } from "@/components/dashboard/candidate-status-badge";
import { CandidateActions } from "@/components/dashboard/candidate-actions";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { candidates, loading } = useCandidates();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                   <Skeleton className="h-8 w-[100px] ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" /> Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Enter the details of the new candidate to add them to the hiring pipeline.
              </DialogDescription>
            </DialogHeader>
            <AddCandidateForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Hiring Pipeline</CardTitle>
          <CardDescription>
            Manage and track candidates through various hiring stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <div className="text-center py-10">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-medium">No candidates yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first candidate to get started.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Added On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{candidate.email}</TableCell>
                    <TableCell>
                      <CandidateStatusBadge status={candidate.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {format(new Date(candidate.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <CandidateActions candidate={candidate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {candidates.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground">
            Showing {candidates.length} candidate{candidates.length === 1 ? '' : 's'}.
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
