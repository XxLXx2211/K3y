import React from "react";
import { Input, Textarea, Select, SelectItem, Button, Checkbox } from "@heroui/react";
import { ApiKeyItem } from "../types/api-key";

interface ApiKeyFormProps {
  initialData: ApiKeyItem | null;
  onSubmit: (data: ApiKeyItem) => Promise<void>;
}

const categories = [
  { value: "AI", label: "AI" },
  { value: "Payment", label: "Payment" },
  { value: "Cloud", label: "Cloud" },
  { value: "Analytics", label: "Analytics" },
  { value: "Social", label: "Social" },
  { value: "Other", label: "Other" }
];

export function ApiKeyForm({ initialData, onSubmit }: ApiKeyFormProps) {
  const [formData, setFormData] = React.useState<ApiKeyItem>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    service: initialData?.service || "",
    key: initialData?.key || "",
    category: initialData?.category || "Other",
    description: initialData?.description || "",
    expiration: initialData?.expiration || "",
  });
  
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showKey, setShowKey] = React.useState(false);
  const [hasExpiration, setHasExpiration] = React.useState(!!initialData?.expiration);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field: keyof ApiKeyItem, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.service.trim()) {
      newErrors.service = "Service name is required";
    }
    
    if (!formData.key.trim()) {
      newErrors.key = "API key is required";
    }
    
    if (hasExpiration && !formData.expiration) {
      newErrors.expiration = "Please select an expiration date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate() && !isSubmitting) {
      try {
        setIsSubmitting(true);

        // If no expiration is set, ensure the field is empty
        const finalData = {
          ...formData,
          expiration: hasExpiration ? formData.expiration : ""
        };

        await onSubmit(finalData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        placeholder="My API Key"
        value={formData.name}
        onValueChange={(value) => handleChange("name", value)}
        isRequired
        isInvalid={!!errors.name}
        errorMessage={errors.name}
      />
      
      <Input
        label="Service"
        placeholder="OpenAI, Stripe, AWS, etc."
        value={formData.service}
        onValueChange={(value) => handleChange("service", value)}
        isRequired
        isInvalid={!!errors.service}
        errorMessage={errors.service}
      />
      
      <Select
        label="Category"
        placeholder="Select a category"
        selectedKeys={[formData.category]}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        {categories.map((category) => (
          <SelectItem key={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </Select>
      
      <Input
        label="API Key"
        placeholder="Enter your API key"
        value={formData.key}
        onValueChange={(value) => handleChange("key", value)}
        type={showKey ? "text" : "password"}
        isRequired
        isInvalid={!!errors.key}
        errorMessage={errors.key}
        endContent={
          <Button
            variant="light"
            size="sm"
            onPress={() => setShowKey(!showKey)}
          >
            {showKey ? "Hide" : "Show"}
          </Button>
        }
      />
      
      <Textarea
        label="Description (Optional)"
        placeholder="Add notes or description about this API key"
        value={formData.description}
        onValueChange={(value) => handleChange("description", value)}
      />
      
      <div className="space-y-2">
        <Checkbox
          isSelected={hasExpiration}
          onValueChange={setHasExpiration}
        >
          Set expiration date
        </Checkbox>
        
        {hasExpiration && (
          <Input
            type="date"
            label="Expiration Date"
            value={formData.expiration}
            onChange={(e) => handleChange("expiration", e.target.value)}
            isInvalid={!!errors.expiration}
            errorMessage={errors.expiration}
            min={new Date().toISOString().split('T')[0]}
          />
        )}
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          color="primary"
          className="w-full"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
        >
          {isSubmitting
            ? (initialData ? "Updating..." : "Saving...")
            : (initialData ? "Update API Key" : "Save API Key")
          }
        </Button>
      </div>
    </form>
  );
}