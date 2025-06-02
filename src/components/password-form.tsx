import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Slider,
  Progress,
  Chip,
  Divider
} from '@heroui/react';
import { PasswordItem } from '../types/api-key';
import { generatePassword, calculatePasswordStrength, defaultPasswordOptions, PasswordOptions } from '../utils/password-generator';

interface PasswordFormProps {
  onSubmit: (password: PasswordItem) => void;
  initialData?: PasswordItem | null;
}

const categories = [
  { value: 'social', label: 'Redes Sociales' },
  { value: 'email', label: 'Email' },
  { value: 'banking', label: 'Banca' },
  { value: 'work', label: 'Trabajo' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'shopping', label: 'Compras' },
  { value: 'entertainment', label: 'Entretenimiento' },
  { value: 'utilities', label: 'Servicios' },
  { value: 'other', label: 'Otros' }
];

export function PasswordForm({ onSubmit, initialData }: PasswordFormProps) {
  const [formData, setFormData] = useState<Partial<PasswordItem>>({
    name: '',
    service: '',
    password: '',
    category: 'other',
    description: '',
    expiration: ''
  });

  const [hasExpiration, setHasExpiration] = useState(false);
  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>(defaultPasswordOptions);
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''));
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setHasExpiration(!!initialData.expiration);
      if (initialData.password) {
        setPasswordStrength(calculatePasswordStrength(initialData.password));
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    }
  }, [formData.password]);

  const handleInputChange = (field: keyof PasswordItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePassword = () => {
    try {
      const newPassword = generatePassword(passwordOptions);
      setFormData(prev => ({ ...prev, password: newPassword }));
      onClose();
    } catch (error) {
      console.error('Error generating password:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.service || !formData.password) {
      return;
    }

    const passwordData: PasswordItem = {
      id: initialData?.id || '',
      name: formData.name,
      service: formData.service,
      password: formData.password,
      category: formData.category || 'other',
      description: formData.description || '',
      expiration: hasExpiration ? formData.expiration || '' : '',
      created_at: initialData?.created_at,
      updated_at: initialData?.updated_at
    };

    onSubmit(passwordData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre"
          placeholder="Ej: Mi cuenta principal"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          isRequired
        />

        <Input
          label="Servicio"
          placeholder="Ej: Gmail, Facebook, etc."
          value={formData.service || ''}
          onChange={(e) => handleInputChange('service', e.target.value)}
          isRequired
        />

        <Select
          label="Categoría"
          placeholder="Selecciona una categoría"
          selectedKeys={formData.category ? [formData.category] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0] as string;
            handleInputChange('category', selectedKey);
          }}
        >
          {categories.map((category) => (
            <SelectItem key={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </Select>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              label="Contraseña"
              placeholder="Ingresa o genera una contraseña"
              value={formData.password || ''}
              onChange={(e) => handleInputChange('password', e.target.value)}
              type="password"
              isRequired
              className="flex-1"
            />
            <Button
              color="primary"
              variant="flat"
              onPress={onOpen}
              className="mt-6"
            >
              Generar
            </Button>
          </div>
          
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Progress
                  value={passwordStrength.score}
                  color={passwordStrength.color as any}
                  className="flex-1"
                />
                <Chip
                  color={passwordStrength.color as any}
                  variant="flat"
                  size="sm"
                >
                  {passwordStrength.label}
                </Chip>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-sm text-gray-600">
                  Sugerencias: {passwordStrength.feedback.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        <Textarea
          label="Descripción"
          placeholder="Información adicional (opcional)"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />

        <div className="space-y-2">
          <Checkbox
            isSelected={hasExpiration}
            onValueChange={setHasExpiration}
          >
            Establecer fecha de expiración
          </Checkbox>
          
          {hasExpiration && (
            <Input
              type="date"
              label="Fecha de expiración"
              value={formData.expiration || ''}
              onChange={(e) => handleInputChange('expiration', e.target.value)}
            />
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" color="primary" className="flex-1">
            {initialData ? 'Actualizar' : 'Guardar'} Contraseña
          </Button>
        </div>
      </form>

      {/* Modal del Generador de Contraseñas */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Generador de Contraseñas Seguras</ModalHeader>
          <ModalBody className="space-y-4">
            <div>
              <label className="text-sm font-medium">Longitud: {passwordOptions.length}</label>
              <Slider
                value={passwordOptions.length}
                onChange={(value) => setPasswordOptions(prev => ({ ...prev, length: Array.isArray(value) ? value[0] : value }))}
                minValue={4}
                maxValue={128}
                step={1}
                className="mt-2"
              />
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                isSelected={passwordOptions.includeUppercase}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeUppercase: checked }))}
              >
                Mayúsculas (A-Z)
              </Checkbox>

              <Checkbox
                isSelected={passwordOptions.includeLowercase}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeLowercase: checked }))}
              >
                Minúsculas (a-z)
              </Checkbox>

              <Checkbox
                isSelected={passwordOptions.includeNumbers}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeNumbers: checked }))}
              >
                Números (0-9)
              </Checkbox>

              <Checkbox
                isSelected={passwordOptions.includeSymbols}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, includeSymbols: checked }))}
              >
                Símbolos (!@#$...)
              </Checkbox>
            </div>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <Checkbox
                isSelected={passwordOptions.excludeSimilar}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, excludeSimilar: checked }))}
              >
                Excluir similares (i, l, 1, L, o, 0, O)
              </Checkbox>

              <Checkbox
                isSelected={passwordOptions.excludeAmbiguous}
                onValueChange={(checked) => setPasswordOptions(prev => ({ ...prev, excludeAmbiguous: checked }))}
              >
                Excluir ambiguos ({`{ } [ ] ( ) / \\ ' " \` ~ , ; . < >`})
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button color="primary" onPress={handleGeneratePassword}>
              Generar Contraseña
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
