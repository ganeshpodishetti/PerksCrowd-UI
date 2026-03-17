import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { FormData } from './types';

interface DateSelectionProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function DateSelection({ formData, handleInputChange }: DateSelectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input id="endDate" name="endDate" type="date" value={formData.endDate || ''} onChange={handleInputChange} />
      </div>
    </div>
  );
}