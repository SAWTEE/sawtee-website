import PrimaryButton from "@/Components/Backend/PrimaryButton";
import { useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    useToast,
    Modal,
    ModalOverlay,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    useColorModeValue,
} from "@chakra-ui/react";

export default function DeleteMenuForm({ isOpen, onClose, item, setMenuItem }) {
    const { delete: destroy, processing } = useForm();
    const toast = useToast();

    const submit = (e) => {
        e.preventDefault();
        destroy(route("admin.deleteMenuItem.menu", item.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    position: "top-right",
                    title: "Menu Item deleted.",
                    description: "Menu Item deleted Successfully",
                    status: "error",
                    duration: 6000,
                    isClosable: true,
                });
                setMenuItem(null);
                onClose();
            },
            onError: () => console.log("Error while deleting"),
        });
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "xs", md: "md" }}
        >
            <ModalOverlay />
            <ModalContent
                as="form"
                onSubmit={submit}
                bg={useColorModeValue("whiteAlpha.500", "blackAlpha.500")}
                backdropFilter={"blur(5px)"}
            >
                <ModalHeader>Delete Menu</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert status="warning">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>
                                This action is irreversible.
                            </AlertTitle>
                            <AlertDescription>
                                Are you sure you want to delete this menu item ?
                            </AlertDescription>
                        </Box>
                    </Alert>
                </ModalBody>

                <ModalFooter>
                    <PrimaryButton
                        colorScheme="blue"
                        type="submit"
                        isLoading={processing}
                        mr={3}
                    >
                        Delete
                    </PrimaryButton>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            onClose();
                            setMenuItem(null);
                        }}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
