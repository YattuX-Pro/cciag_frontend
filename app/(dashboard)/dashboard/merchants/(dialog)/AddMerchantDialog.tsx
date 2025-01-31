"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Card, CardContent } from "@/components/ui/card";
import { Plus, Upload, Camera, CreditCard, CheckCircle2 } from "lucide-react";
import type { Merchant } from "@/types";
import { cn } from "@/lib/utils";

const mockMerchants: Merchant[] = [
  {
    id: "1",
    businessName: "Acme Corp",
    ownerName: "John Smith",
    email: "john@acmecorp.com",
    phone: "+1234567890",
    address: "123 Business St, City",
    status: "active",
    createdAt: "2024-03-20",
    signature: "",
    photo: "",
  },
];

const steps = [
  { id: 1, title: "Information Commerçant" },
  { id: 2, title: "Photo & Signature" },
  { id: 3, title: "Paiement" },
  { id: 4, title: "Revu & Soummison" },
];

export default function AddMerchantDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    photo: null as string | null,
    signature: null as string | null,
    paymentComplete: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const changeStep = (step: number) => {
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Nom</Label>
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
                <Label htmlFor="businessName">Prenom</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
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
              <Label htmlFor="address">Addresse</Label>
              <Input
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
              <Label>Photo</Label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8">
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
                        onClick={() =>
                          setFormData({ ...formData, photo: null })
                        }
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  ) : (
                    <label className="w-full cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-primary mb-4" />
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
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-8">
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
                        <Upload className="w-12 h-12 text-primary mb-4" />
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
            <div className="bg-primary/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CreditCard className="w-6 h-6 text-primary mr-2" />
                  <h3 className="text-lg font-semibold">Paiement</h3>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Complétez le paiement pour finaliser l'enrôlement
              </p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  setFormData({ ...formData, paymentComplete: true });
                }}
              >
                Process Payment
              </Button>
            </div>

            {formData.paymentComplete && (
              <div className="flex items-center justify-center p-4 bg-cyan-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-2" />
                <span className="text-cyan-500">
                  Payment completed successfully
                </span>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Information Enrolement
                </Label>
                <Card className="border-primary/20">
                  <CardContent className="pt-6">
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Business Name
                        </dt>
                        <dd className="font-medium">{formData.businessName}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Owner Name
                        </dt>
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
                <Label className="text-muted-foreground">
                  Statut de paiement
                </Label>
                <div className="p-4 bg-cyan-500/10 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-2" />
                    <span className="text-cyan-500">Payment verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Enroller un Commerçant
            </Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              "sm:max-w-[800px]",
              "bg-white opacity-100",
              "dark:bg-gray-900/50 bg-white/50",
              "backdrop-blur-sm",
              "dark:border-cyan-900/20 border-cyan-200/20",
              "shadow-lg"
            )}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                Nouveau Commerçant
              </DialogTitle>
            </DialogHeader>
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center ${
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      onClick={() => changeStep(step.id)}
                      className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center mr-2 ${
                        currentStep >= step.id
                          ? "bg-primary text-white"
                          : "bg-muted border-2 border-muted-foreground"
                      }`}
                    >
                      {step.id}
                    </div>
                    <span className="hidden md:inline text-sm">
                      {step.title}
                    </span>
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
                  setIsOpen(false);
                  setCurrentStep(1);
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
                      setIsOpen(false);
                      setCurrentStep(1);
                    }
                  }}
                  className="border-primary/20"
                >
                  {currentStep === 1 ? "Cancel" : "Previous"}
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={currentStep === 3 && !formData.paymentComplete}
                >
                  {currentStep === steps.length ? "Submit" : "Next"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
