import PrimaryButton from "@/Components/Backend/PrimaryButton";
import { DataTable } from "@/Components/Backend/DataTable";
import AuthenticatedLayout from "@/Pages/Backend/Layouts/AuthenticatedLayout";
import {
    Box,
    Tag,
    HStack,
    useToast,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { Head, Link, useForm } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    TableDeleteAction,
    TableEditAction,
} from "@/Components/Backend/TableActions";
import React from "react";
import DeletePostModal from "./Partials/DeletePostModal";

export default function Index({ auth, posts }) {
    const toast = useToast();
    const columnHelper = createColumnHelper();
    const { processing, get, delete: destroy } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [postId, setPostId] = React.useState(null);

    const handleDelete = (e, id) => {
        e.preventDefault();
        setPostId(id);
        onOpen();
    };
    function getStatusColor(status) {
        if (status === "unpublished") {
            return "red";
        }
        if (status === "draft") {
            return "blue";
        }
        return "green";
    }

    const TagsColumn = ({ tags }) => {
        return (
            <HStack columns={{ base: 1, lg: 2 }} spacing={2}>
                {tags.map((tag) => {
                    return (
                        <Tag colorScheme="blue" key={tag.id}>
                            {tag.name}
                        </Tag>
                    );
                })}
            </HStack>
        );
    };

    const handleEdit = (e, post) => {
        e.preventDefault();
        get(route("admin.posts.edit", post));
    };

    // const handleDelete = (e, post) => {
    //     e.preventDefault();
    //     destroy(route("admin.posts.destroy", post), {
    //         preserveScroll: true,
    //         onSuccess: () =>
    //             toast({
    //                 position: "top-right",
    //                 title: `Post ID: ${post} deleted.`,
    //                 description: `Post  deleted Successfully`,
    //                 status: "error",
    //                 duration: 6000,
    //                 isClosable: true,
    //             }),
    //         onError: () => console.log("Error while deleting"),
    //     });
    // };

    const defaultColumns = React.useMemo(
        () => [
            columnHelper.accessor("title", {
                cell: (info) => (
                    <Text w="64" noOfLines={1}>
                        {info.getValue()}
                    </Text>
                ),
                header: "Title",
            }),
            columnHelper.accessor("category.name", {
                cell: (info) => (
                    <Tag colorScheme="green">{info.getValue()}</Tag>
                ),
                header: "Category",
            }),
            columnHelper.accessor("theme.title", {
                cell: (info) => (!info.getValue() ? "None" : info.getValue()),
                header: "Theme",
            }),
            columnHelper.accessor("tags", {
                cell: (info) => <TagsColumn tags={info.getValue()} />,
                header: "Tags",
                enableHiding: true,
            }),
            columnHelper.accessor("status", {
                cell: (info) => (
                    <Tag colorScheme={getStatusColor(info.getValue())}>
                        {info.getValue()}
                    </Tag>
                ),
                header: "Status",
            }),
            columnHelper.accessor("author", {
                cell: (info) => info.getValue(),
                header: "author",
                enableHiding: true,
            }),
            columnHelper.accessor("id", {
                cell: (info) => {
                    return (
                        <HStack spacing={4}>
                            <TableEditAction
                                onClick={(e) => handleEdit(e, info.getValue())}
                                isDisabled={processing}
                            />
                            <TableDeleteAction
                                onClick={(e) =>
                                    handleDelete(e, info.getValue())
                                }
                                isDisabled={processing}
                            />
                        </HStack>
                    );
                },
                header: "Actions",
            }),
        ],
        []
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Posts" />
            <DeletePostModal
                isOpen={isOpen}
                onClose={onClose}
                postId={postId}
            />
            <Box mb={4}>
                <Link as="button" href={route("admin.posts.create")}>
                    <PrimaryButton>Create New Post</PrimaryButton>
                </Link>
            </Box>
            <DataTable defaultColumns={defaultColumns} data={posts.data} />
        </AuthenticatedLayout>
    );
}
