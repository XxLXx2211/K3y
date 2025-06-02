import React from "react";
import { Card, Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ApiKeyForm } from "./components/api-key-form";
import { ApiKeyItem } from "./types/api-key";
import { apiKeyService } from "./services/api-key-service";

export default function App() {
  const [apiKeys, setApiKeys] = React.useState<ApiKeyItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKey, setSelectedKey] = React.useState<ApiKeyItem | null>(null);

  // Load API keys from localStorage
  React.useEffect(() => {
    const loadApiKeys = () => {
      try {
        setLoading(true);
        setError(null);

        // Clear any existing mock data and start fresh
        // This ensures we start with a completely empty database

        // Load API keys from localStorage (will be empty initially)
        const keys = apiKeyService.getAllApiKeys();
        setApiKeys(keys);
      } catch (err) {
        console.error('Error loading API keys:', err);
        setError('Failed to load API keys. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadApiKeys();
  }, []);

  const filteredKeys = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      return apiKeys;
    }

    return apiKeys.filter(key =>
      key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (key.description && key.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [apiKeys, searchQuery]);

  const handleAddKey = async (newKey: ApiKeyItem) => {
    try {
      if (selectedKey) {
        // Update existing key
        const updatedKey = apiKeyService.updateApiKey(selectedKey.id, newKey);
        if (updatedKey) {
          setApiKeys(apiKeys.map(key => key.id === selectedKey.id ? updatedKey : key));
        }
        setSelectedKey(null);
      } else {
        // Create new key
        const createdKey = apiKeyService.createApiKey(newKey);
        setApiKeys([createdKey, ...apiKeys]);
      }
    } catch (err) {
      console.error('Error saving API key:', err);
      setError('Failed to save API key. Please try again.');
    }
  };

  const handleEdit = (key: ApiKeyItem) => {
    setSelectedKey(key);
    onOpen();
  };

  const handleDelete = async (id: string) => {
    try {
      const success = apiKeyService.deleteApiKey(id);
      if (success) {
        setApiKeys(apiKeys.filter(key => key.id !== id));
      }
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key. Please try again.');
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const renderKeyValue = (key: string) => {
    const visiblePart = key.substring(0, 4);
    const hiddenPart = "•".repeat(Math.max(0, key.length - 8));
    const lastPart = key.substring(key.length - 4);
    
    return (
      <div className="flex items-center gap-2">
        <span>{visiblePart}{hiddenPart}{lastPart}</span>
        <Tooltip content="Copy to clipboard">
          <Button 
            isIconOnly 
            size="sm" 
            variant="light" 
            onPress={() => handleCopyKey(key)}
          >
            <Icon icon="lucide:copy" className="text-default-500" />
          </Button>
        </Tooltip>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-default-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">API Key Manager</h1>

        {error && (
          <Card className="mb-6 border-danger-200 bg-danger-50">
            <div className="p-4 flex items-center gap-3">
              <Icon icon="lucide:alert-circle" className="text-danger-600" />
              <div className="flex-1">
                <p className="text-danger-800 font-medium">Error</p>
                <p className="text-danger-700 text-sm">{error}</p>
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setError(null)}
              >
                <Icon icon="lucide:x" className="text-danger-600" />
              </Button>
            </div>
          </Card>
        )}
        
        <Card className="mb-6">
          <div className="p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by name, service or category..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="max-w-md"
            />
            <Button 
              color="primary" 
              onPress={onOpen}
              startContent={<Icon icon="lucide:plus" />}
            >
              Add New API Key
            </Button>
          </div>
        </Card>
        
        <Card>
          <Table 
            aria-label="API Keys table"
            removeWrapper
            classNames={{
              th: "bg-default-50 text-default-600",
            }}
          >
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>SERVICE</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>API KEY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No API keys found. Add your first one!">
              {filteredKeys.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {item.description && (
                        <span className="text-tiny text-default-400">{item.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>
                    <Chip 
                      size="sm" 
                      variant="flat" 
                      color={getCategoryColor(item.category)}
                    >
                      {item.category}
                    </Chip>
                  </TableCell>
                  <TableCell>{renderKeyValue(item.key)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Tooltip content="Edit">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          onPress={() => handleEdit(item)}
                        >
                          <Icon icon="lucide:edit" className="text-default-500" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <Button 
                          isIconOnly 
                          size="sm" 
                          variant="light" 
                          color="danger" 
                          onPress={() => handleDelete(item.id)}
                        >
                          <Icon icon="lucide:trash-2" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedKey ? "Edit API Key" : "Add New API Key"}
              </ModalHeader>
              <ModalBody>
                <ApiKeyForm
                  initialData={selectedKey}
                  onSubmit={async (data) => {
                    await handleAddKey(data);
                    onClose();
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// Helper functions
function getCategoryColor(category: string) {
  const categories: Record<string, "primary" | "secondary" | "success" | "warning" | "danger" | "default"> = {
    "AI": "primary",
    "Payment": "success",
    "Cloud": "secondary",
    "Analytics": "warning",
    "Social": "danger"
  };
  
  return categories[category] || "default";
}

// Utility functions for future use
// function getExpirationColor(date: string) {
//   const expirationDate = new Date(date);
//   const today = new Date();
//   const daysUntilExpiration = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//
//   if (daysUntilExpiration < 0) return "text-danger";
//   if (daysUntilExpiration < 30) return "text-warning";
//   return "text-success";
// }

// function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric'
//   }).format(date);
// }