import { IconButton, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import moment from 'moment-timezone';
import React from "react";
import APIUtils from "../src/Services/APIUtils";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import ConfirmDialog from "./dialog/ConfirmDialog";
import Router from "next/router";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import UploadDialog from "./dialog/UploadDialog";

export default function TacticDataTable() {
    const [pageSize, setPageSize] = React.useState(20);
    const [isLoading, setIsLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [pageInfo, setPageInfo] = React.useState<{ current_page: number, last_page: number, per_page: number, total: number }>({ current_page: 1, last_page: 1, per_page: 20, total: 1 });
    const [rowCountState, setRowCountState] = React.useState(0);
    const [dialog, setDialog] = React.useState<{ isOpen: boolean, isLoading: boolean, title: string, message: string, handleClose: any, handleSubmit: any }>({ isOpen: false, isLoading: false, title: '', message: '', handleClose: () => { }, handleSubmit: () => { } });
    const [uploadDialog, setUploadDialog] = React.useState<{ isOpen: boolean, isLoading: boolean, title: string, handleClose: any, handleSubmit: any, onFilesChange: any }>({ isOpen: false, isLoading: false, title: '', handleClose: () => { }, handleSubmit: () => { }, onFilesChange: () => { } });
    // const [fileList, setFileList] = React.useState<File[]>([]);
    let fileList: File[] = [];

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'start_date', headerName: 'Start Date', flex: 1,
            valueGetter: (params: GridValueGetterParams) => {
                const dateTime = moment.tz(params.value, 'UTC');

                return dateTime.tz('Asia/Bangkok').format('DD/MM/YYYY');
            },
        },
        {
            field: 'end_date', headerName: 'End Date', flex: 1,
            valueGetter: (params: GridValueGetterParams) => {
                if (!params.value) return '';
                const dateTime = moment.tz(params.value, 'UTC');

                return dateTime.tz('Asia/Bangkok').format('DD/MM/YYYY');
            },
        },
        { field: 'author', headerName: 'Author', flex: 1 },
        {
            field: 'id',
            headerName: 'Action',
            flex: 1,
            sortable: false,
            renderCell: (params) => {
                function handleDelete() {
                    setDialog({
                        isOpen: true,
                        isLoading: false,
                        title: 'Confirm Delete',
                        message: `Are you sure you want to delete '${params.row.name}' tactic?`,
                        handleClose: () => {
                            setDialog(prevDialogState => ({
                                ...prevDialogState,
                                isOpen: false
                            }));

                        },
                        handleSubmit: () => {
                            setDialog(prevDialogState => ({
                                ...prevDialogState,
                                isLoading: true
                            }));

                            APIUtils.fetch('DELETE', `api/tactics/${params.row.id}`).then(response => {
                                setDialog(prevDialogState => ({
                                    ...prevDialogState,
                                    isOpen: false,
                                    isLoading: false
                                }));

                                setData(prevData => {
                                    const index = prevData.findIndex((item: any) => {
                                        return item.id === params.row.id;
                                    });

                                    return [
                                        ...data.slice(0, index),
                                        ...data.slice(index + 1)
                                    ]
                                });
                            });
                        }
                    });
                }

                function handleEdit() {
                    Router.push({
                        pathname: `/tactics/edit/${params.row.id}`,
                    })
                }

                function handleChart() {
                    Router.push({
                        pathname: `/tactics/profit/${params.row.id}`,
                    })
                }

                function openUploadDialog() {
                    fileList = [];

                    setUploadDialog({
                        isOpen: true,
                        isLoading: false,
                        title: `Upload CSV: ${params.row.name}`,
                        handleClose: (event: object, reason: string) => {
                            if (reason !== "backdropClick") {
                                setUploadDialog(prevDialogState => ({
                                    ...prevDialogState,
                                    isOpen: false
                                }));
                            }
                        },
                        handleSubmit: () => {
                            setUploadDialog(prevDialogState => ({
                                ...prevDialogState,
                                isLoading: true
                            }));

                            APIUtils.upload(`/api/tactics/${params.row.id}/upload-csv`, fileList).then(response => {
                                console.log("ok");
                                setUploadDialog(prevDialogState => ({
                                    ...prevDialogState,
                                    isOpen: false
                                }));
                            })
                        },
                        onFilesChange: (files: File[]) => {
                            fileList = files;
                        }
                    });
                }

                return (
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="chart" color="primary" onClick={handleChart}>
                            <BarChartIcon />
                        </IconButton>
                        <IconButton aria-label="edit" color="primary" onClick={handleEdit}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="uploadDialog" color="primary" onClick={openUploadDialog}>
                            <FileUploadIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                )
            }
        },
    ];

    React.useEffect(() => {
        callTacticData();
    }, []);

    function callTacticData(newPage: number = 0) {
        setIsLoading(true);
        const page = newPage + 1;
        const url = `/api/tactics?page=${page}`;

        APIUtils.fetch('GET', url).then(response => {
            setData(response?.data.data);
            setRowCountState(response?.data.total);
            setPageSize(response?.data.per_page);
            setPageInfo(response?.data);
            setIsLoading(false);
        });
    }

    function onPageChange(newPage: number) {
        callTacticData(newPage);
    }

    return (
        <div style={{ height: 700, width: '100%' }}>
            <ConfirmDialog
                isOpen={dialog.isOpen}
                title={dialog.title}
                message={dialog.message}
                handleClose={dialog.handleClose}
                handleSubmit={dialog.handleSubmit}
                isLoading={dialog.isLoading}
            />
            <UploadDialog
                isOpen={uploadDialog.isOpen}
                title={uploadDialog.title}
                handleClose={uploadDialog.handleClose}
                handleSubmit={uploadDialog.handleSubmit}
                isLoading={uploadDialog.isLoading}
                onFilesChange={uploadDialog.onFilesChange}
            />
            <DataGrid
                sx={{ mt: 4 }}
                rows={data}
                rowCount={rowCountState}
                loading={isLoading}
                rowsPerPageOptions={[20]}
                pagination
                page={pageInfo.current_page - 1}
                pageSize={pageSize}
                paginationMode="server"
                onPageChange={(newPage) => onPageChange(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                columns={columns}
                checkboxSelection={false}
                disableSelectionOnClick={true}
            />
        </div>
    );
}