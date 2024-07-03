import PrimaryButton from '@/Components/Backend/PrimaryButton';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';

export default function EditMenuForm({ isOpen, onClose, menu }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    title: menu.title,
    location: menu.location,
  });
  const toast = useToast();

  const submit = e => {
    e.preventDefault();

    post(
      route('admin.update.menu', {
        _method: 'patch',
        menu: menu,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            position: 'top-right',
            title: 'Menu edited.',
            description: 'Menu edited Successfully',
            status: 'success',
            duration: 6000,
            isClosable: true,
          });
          onClose();
        },
        onError: errors => {
          if (errors.title) {
            reset('title');
          }
          if (errors.location) {
            reset('location');
          }
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={submit}>
        <ModalHeader>Edit Menu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack gap="6" alignItems={'start'}>
            <FormControl mt="4" isInvalid={errors.title} isRequired>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Input
                id="title"
                name="title"
                value={data.title}
                onChange={e => setData('title', e.target.value)}
              />

              {errors.title && (
                <FormErrorMessage mt="2">{errors.title}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl mt="4" isInvalid={errors.location} isRequired>
              <FormLabel htmlFor="location">location</FormLabel>

              <Input
                id="location"
                name="location"
                value={data.location}
                onChange={e => setData('location', e.target.value)}
              />

              {errors.location && (
                <FormErrorMessage mt="2">{errors.location}</FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <PrimaryButton type="submit" isLoading={processing}>
            Save
          </PrimaryButton>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
