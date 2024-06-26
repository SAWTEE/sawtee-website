import DangerButton from '@/Components/Backend/DangerButton';
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast,
} from '@chakra-ui/react';
import { useForm } from '@inertiajs/react';

export default function DeletePostModal({ isOpen, onClose, postId }) {
	const { delete: destroy, processing } = useForm();
	const toast = useToast();
	const submit = e => {
		e.preventDefault();
        destroy(route('admin.posts.destroy', postId), {
            preserveState: true,
			preserveScroll: true,
			onSuccess: () => {
				toast({
					position: 'top-right',
					title: 'Post deleted.',
					description: 'Post deleted Successfully',
					status: 'warning',
					duration: 6000,
					isClosable: true,
				});

				onClose();
			},
			onError: () => console.log('Error while deleting'),
		});
	};
	return (
		<Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
			<ModalOverlay />
			<ModalContent as="form" onSubmit={submit}>
				<ModalHeader>Delete Post : {postId}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Alert status="warning">
						<AlertIcon />
						<Box>
							<AlertTitle>This action is irreversible.</AlertTitle>
							<AlertDescription>{'Are you sure you want to delete this Post?'}</AlertDescription>
						</Box>
					</Alert>
				</ModalBody>

				<ModalFooter>
					<DangerButton type="submit" isLoading={processing} mr={3}>
						Delete
					</DangerButton>
					<Button variant="ghost" onClick={onClose}>
						Cancel
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
