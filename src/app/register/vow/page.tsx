
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScribeSigil } from '@/components/icons';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { AcquisitionButton } from '@/components/ui/acquisition-button';

const steps = [
  { id: 'vow', title: 'The Vow', description: 'Declare your purpose to the Nexus.' },
  { id: 'identity', title: 'The Identity', description: 'Name your world and your voice.' },
  { id: 'covenant', title: 'The Covenant', description: 'Choose your path of mastery.' },
];

export default function VowPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    sacrifice: '',
    vow: '',
    canvasName: '',
    agentAlias: '',
    covenant: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCovenantChange = (value: string) => {
    setFormData(prev => ({ ...prev, covenant: value }));
  };
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast({
        title: "Vow Accepted",
        description: "Your workspace is being forged...",
    });

    // Mock submission
    setTimeout(() => {
        setIsLoading(false);
        router.push('/');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sacrifice">What old way of working must be sacrificed?</Label>
              <Textarea
                id="sacrifice"
                name="sacrifice"
                placeholder="e.g., 'The tyranny of a thousand browser tabs...'"
                value={formData.sacrifice}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vow">What new reality will you build?</Label>
              <Textarea
                id="vow"
                name="vow"
                placeholder="e.g., 'A reality of silent, effortless automation...'"
                value={formData.vow}
                onChange={handleChange}
                className="min-h-[80px]"
              />
            </div>
          </div>
        );
      case 1:
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                <Label htmlFor="canvasName">Name your Digital Nation (Workspace)</Label>
                <Input
                    id="canvasName"
                    name="canvasName"
                    placeholder="e.g., 'The Crimson Hand'"
                    value={formData.canvasName}
                    onChange={handleChange}
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="agentAlias">Give your Agentic Voice a Name</Label>
                <Input
                    id="agentAlias"
                    name="agentAlias"
                    placeholder="e.g., 'BEEP', 'Oracle', 'Jeeves'"
                    value={formData.agentAlias}
                    onChange={handleChange}
                />
                </div>
            </div>
        );
       case 2:
        return (
            <RadioGroup 
                value={formData.covenant}
                onValueChange={handleCovenantChange}
                className="space-y-4"
            >
                <Label>Choose your Covenant. This choice attunes the OS to your core philosophy and cannot be changed.</Label>
                
                <Card className={formData.covenant === 'motion' ? 'border-primary' : ''}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem value="motion" id="motion" />
                        <Label htmlFor="motion" className="flex-grow cursor-pointer">
                            <h4 className="font-bold text-primary-foreground">The Covenant of Motion</h4>
                            <p className="text-sm text-muted-foreground">"I will build faster than chaos."</p>
                        </Label>
                    </CardContent>
                </Card>

                <Card className={formData.covenant === 'worship' ? 'border-primary' : ''}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem value="worship" id="worship" />
                         <Label htmlFor="worship" className="flex-grow cursor-pointer">
                            <h4 className="font-bold text-primary-foreground">The Covenant of Worship</h4>
                            <p className="text-sm text-muted-foreground">"I will automate what others worship."</p>
                        </Label>
                    </CardContent>
                </Card>

                <Card className={formData.covenant === 'silence' ? 'border-primary' : ''}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <RadioGroupItem value="silence" id="silence" />
                        <Label htmlFor="silence" className="flex-grow cursor-pointer">
                            <h4 className="font-bold text-primary-foreground">The Covenant of Silence</h4>
                            <p className="text-sm text-muted-foreground">"I will create the silence of true automation."</p>
                        </Label>
                    </CardContent>
                </Card>
            </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sigil-codex">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <ScribeSigil className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-3xl font-bold mt-4 sigil-obelisk text-primary-foreground">The Rite of Invocation</h1>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                            currentStep > index ? "bg-primary border-primary" : "",
                            currentStep === index ? "border-primary scale-110" : "border-muted",
                            currentStep < index ? "bg-muted/20 border-muted" : ""
                        )}>
                            {currentStep > index ? '✓' : index + 1}
                        </div>
                        <p className={cn("text-xs mt-2", currentStep >= index ? "text-primary-foreground" : "text-muted-foreground")}>{step.title}</p>
                    </div>
                    {index < steps.length - 1 && <div className="flex-grow h-0.5 bg-muted mx-2"></div>}
                </React.Fragment>
            ))}
        </div>

        <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="p-8 bg-card/80 backdrop-blur-sm border border-primary/20 shadow-lg shadow-primary/10 rounded-lg"
        >
            <h2 className="text-xl font-bold mb-1 text-primary-foreground">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
                {renderStepContent()}
                <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0 || isLoading}>
                    Previous
                    </Button>
                    
                    {currentStep < steps.length - 1 ? (
                    <Button type="button" onClick={nextStep}>
                        Next
                    </Button>
                    ) : (
                    <AcquisitionButton type="submit" disabled={isLoading || !formData.covenant}>
                        {isLoading ? 'Forging...' : 'Complete the Rite'}
                    </AcquisitionButton>
                    )}
                </div>
            </form>
        </motion.div>
      </div>
    </div>
  );
}
