'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, Camera, CreditCard, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const steps = [
  { id: 1, title: 'Business Information' },
  { id: 2, title: 'Documents & Signature' },
  { id: 3, title: 'Payment' },
  { id: 4, title: 'Review & Submit' },
];

export default function AddMerchantPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    photo: null as string | null,
    signature: null as string | null,
    paymentComplete: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label>Business Photo</Label>
              <div className="border-2 border-dashed border-cyan-500/20 rounded-lg p-8">
                <div className="flex flex-col items-center">
                  {formData.photo ? (
                    <div className="relative w-full h-48">
                      <img
                        src={formData.photo}
                        alt="Business"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() => setFormData({ ...formData, photo: null })}
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  ) : (
                    <label className="w-full cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-cyan-500 mb-4" />
                        <p className="text-sm text-muted-foreground text-center">
                          Click to upload or drag and drop
                          <br />
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                photo: reader.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Signature</Label>
              <div className="border-2 border-dashed border-cyan-500/20 rounded-lg p-8">
                <div className="flex flex-col items-center">
                  {formData.signature ? (
                    <div className="relative w-full h-32">
                      <img
                        src={formData.signature}
                        alt="Signature"
                        className="w-full h-full object-contain"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        onClick={() =>
                          setFormData({ ...formData, signature: null })
                        }
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  ) : (
                    <label className="w-full cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-cyan-500 mb-4" />
                        <p className="text-sm text-muted-foreground text-center">
                          Upload signature image
                          <br />
                          PNG or JPG (max. 400x200px)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                signature: reader.result as string,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-cyan-500/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-cyan-500 mr-2" />
                  <h3 className="text-lg font-semibold">Payment Details</h3>
                </div>
                <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
                  Required
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Complete the payment to proceed with merchant registration
              </p>
              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                onClick={() => {
                  setFormData({ ...formData, paymentComplete: true });
                }}
              >
                Process Payment
              </Button>
            </div>

            {formData.paymentComplete && (
              <div className="flex items-center justify-center p-4 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-500">Payment completed successfully</span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Business Information</Label>
                <Card className="border-cyan-500/20">
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-muted-foreground">Business Name</dt>
                        <dd className="font-medium">{formData.businessName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Owner Name</dt>
                        <dd className="font-medium">{formData.ownerName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Email</dt>
                        <dd className="font-medium">{formData.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">Phone</dt>
                        <dd className="font-medium">{formData.phone}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Documents</Label>
                <div className="grid grid-cols-2 gap-4">
                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt="Business"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  {formData.signature && (
                    <img
                      src={formData.signature}
                      alt="Signature"
                      className="w-full h-32 object-contain rounded-lg bg-white"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Payment Status</Label>
                <div className="p-4 bg-green-500/10 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-green-500">Payment verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-cyan-500">
            Add New Merchant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    currentStep >= step.id ? 'text-cyan-500' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                      currentStep >= step.id
                        ? 'bg-cyan-500 text-white'
                        : 'bg-muted border-2 border-muted-foreground'
                    }`}
                  >
                    {step.id}
                  </div>
                  <span className="hidden md:inline text-sm">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
              } else {
                // TODO: Submit form
                router.push('/dashboard/merchants');
              }
            }}
          >
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (currentStep > 1) {
                    setCurrentStep(currentStep - 1);
                  } else {
                    router.back();
                  }
                }}
                className="border-cyan-500/20"
              >
                {currentStep === 1 ? 'Cancel' : 'Previous'}
              </Button>
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={currentStep === 3 && !formData.paymentComplete}
              >
                {currentStep === steps.length ? 'Submit' : 'Next'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}