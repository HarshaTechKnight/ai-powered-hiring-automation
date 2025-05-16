
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCandidates } from "@/contexts/candidate-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});

type AddCandidateFormValues = z.infer<typeof formSchema>;

interface AddCandidateFormProps {
  onSuccess?: () => void;
}

export function AddCandidateForm({ onSuccess }: AddCandidateFormProps) {
  const { addCandidate } = useCandidates();
  const { toast } = useToast();

  const form = useForm<AddCandidateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  function onSubmit(values: AddCandidateFormValues) {
    try {
      addCandidate(values);
      toast({
        title: "Candidate Added",
        description: `${values.name} has been added to the pipeline.`,
      });
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add candidate. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to add candidate:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Priya Sharma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="e.g. priya.sharma@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Adding..." : "Add Candidate"}
        </Button>
      </form>
    </Form>
  );
}
