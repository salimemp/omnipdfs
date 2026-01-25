import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Save,
  Download,
  Trash2,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Hash,
  Type,
  ToggleLeft,
  List,
  Upload,
  Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import DropZone from '@/components/shared/DropZone';

const fieldTypes = [
  { id: 'text', label: 'Text', icon: Type },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'phone', label: 'Phone', icon: Phone },
  { id: 'number', label: 'Number', icon: Hash },
  { id: 'date', label: 'Date', icon: Calendar },
  { id: 'textarea', label: 'Long Text', icon: FileText },
  { id: 'select', label: 'Dropdown', icon: List },
  { id: 'checkbox', label: 'Checkbox', icon: ToggleLeft },
];

const sampleForms = [
  {
    id: 1,
    name: 'Job Application',
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'phone', label: 'Phone Number', type: 'phone', required: true },
      { id: 'position', label: 'Position Applied For', type: 'select', options: ['Developer', 'Designer', 'Manager', 'Other'], required: true },
      { id: 'experience', label: 'Years of Experience', type: 'number', required: true },
      { id: 'startDate', label: 'Available Start Date', type: 'date', required: false },
      { id: 'cover', label: 'Cover Letter', type: 'textarea', required: false },
    ]
  },
  {
    id: 2,
    name: 'Contact Form',
    fields: [
      { id: 'name', label: 'Your Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'subject', label: 'Subject', type: 'text', required: true },
      { id: 'message', label: 'Message', type: 'textarea', required: true },
    ]
  },
  {
    id: 3,
    name: 'Event Registration',
    fields: [
      { id: 'name', label: 'Attendee Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'company', label: 'Company', type: 'text', required: false },
      { id: 'ticketType', label: 'Ticket Type', type: 'select', options: ['Standard', 'VIP', 'Student'], required: true },
      { id: 'dietary', label: 'Dietary Requirements', type: 'text', required: false },
      { id: 'newsletter', label: 'Subscribe to Newsletter', type: 'checkbox', required: false },
    ]
  },
];

export default function FormFiller({ theme = 'dark' }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedPdf, setUploadedPdf] = useState(null);

  const isDark = theme === 'dark';

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedForm) return;

    const requiredFields = selectedForm.fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.id]);

    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    toast.success('Form submitted successfully!');
    await base44.entities.ActivityLog.create({
      action: 'upload',
      document_name: `Form: ${selectedForm.name}`,
      details: { form_id: selectedForm.id }
    });
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <Input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.label}
            className={`min-h-[100px] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
          />
        );
      case 'select':
        return (
          <Select value={value} onValueChange={(v) => handleFieldChange(field.id, v)}>
            <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-slate-900 border-slate-700' : ''}>
              {field.options?.map(opt => (
                <SelectItem key={opt} value={opt} className={isDark ? 'text-white' : ''}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={!!value}
              onCheckedChange={(v) => handleFieldChange(field.id, v)}
            />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{field.label}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Form Filler
          </h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fill PDF forms or create fillable forms
          </p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <h2 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Select a Form
          </h2>

          <div className="space-y-3 mb-6">
            {sampleForms.map(form => (
              <button
                key={form.id}
                onClick={() => {
                  setSelectedForm(form);
                  setFormData({});
                }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedForm?.id === form.id
                    ? 'bg-violet-500/20 border-violet-500'
                    : isDark
                      ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                } border`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${selectedForm?.id === form.id ? 'text-violet-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{form.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {form.fields.length} fields
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className={`border-t pt-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Or upload a PDF form
            </p>
            <DropZone
              onFileUploaded={(f) => setUploadedPdf(f)}
              acceptedTypes={['.pdf']}
              maxSize={25 * 1024 * 1024}
              isDark={isDark}
            />
          </div>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 rounded-2xl p-6 ${isDark ? 'glass-light' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          {selectedForm ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedForm.name}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className={isDark ? 'border-slate-700' : ''}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>

              <div className="space-y-5">
                {selectedForm.fields.map(field => (
                  <div key={field.id}>
                    <Label className={`flex items-center gap-2 mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {field.label}
                      {field.required && <span className="text-red-400">*</span>}
                    </Label>
                    {renderField(field)}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Submit Form
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFormData({})}
                  className={isDark ? 'border-slate-700' : ''}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button
                  variant="outline"
                  className={isDark ? 'border-slate-700' : ''}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </>
          ) : (
            <div className={`text-center py-16 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a form from the left panel to get started</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className={`max-w-2xl ${isDark ? 'bg-slate-900 border-slate-700' : ''}`}>
          <DialogHeader>
            <DialogTitle className={isDark ? 'text-white' : ''}>Form Preview</DialogTitle>
          </DialogHeader>
          <div className={`p-6 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
            {selectedForm?.fields.map(field => (
              <div key={field.id} className="mb-4 last:mb-0">
                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {field.label}:
                </span>
                <p className={`mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {formData[field.id] !== undefined 
                    ? (typeof formData[field.id] === 'boolean' ? (formData[field.id] ? 'Yes' : 'No') : formData[field.id])
                    : '-'}
                </p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)} className={isDark ? 'border-slate-700' : ''}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}