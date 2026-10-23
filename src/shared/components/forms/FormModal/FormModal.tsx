import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { ReactNode, useEffect, useRef, useState } from 'react';

export interface FormModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T) => Promise<void>;
  entity?: T | null;
  title: string;
  description: string;
  children: (
    formData: T, 
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, 
    setFormData: React.Dispatch<React.SetStateAction<T>>
  ) => ReactNode;
  initialState: T;
  isLoading: boolean;
  submitText?: string;
}

export function FormModal<T>({
  isOpen,
  onClose,
  onSave,
  entity,
  title,
  description,
  children,
  initialState,
  isLoading,
  submitText = 'Save'
}: FormModalProps<T>) {
  const [formData, setFormData] = useState<T>(initialState);
  const wasOpen = useRef(false);

  useEffect(() => {
    // Reset only when the dialog opens. `entity` and `initialState` are often
    // fresh object literals on every parent render, so depending on their
    // identity used to wipe input the moment the parent re-rendered.
    if (isOpen && !wasOpen.current) {
      setFormData(entity ?? initialState);
    }
    wasOpen.current = isOpen;
  }, [isOpen, entity, initialState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children(formData, handleInputChange, setFormData)}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}