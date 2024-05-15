"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Box, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup, { ConfirmRestorePopup } from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';

function page() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [userList, setUserList] = useState([]);
    const [DeleteId, setDeleteId] = useState();
    const [showPopUp, setShowPopup] = useState(false);
    const [restoreId, setRestoreId] = useState({});
    const [restorePopUp, setRestorePopUp] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');
    

    let clearSearch = (e) => {
        setSearchTerm('');
        fetchUser('')
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchUser(searchTerm)
        }
    }

    useEffect(() => {
        fetchUser();
    }, [page, rowsPerPage])


    const fetchUser = (search = searchTerm, pageNo = page, row = rowsPerPage) => {
        setLoading(true)
        
        callAPI({
            method: 'POST',
            url: '/common/trash',
            data: {
                search: search,
                page: pageNo + 1,
                listPerPage: row,
                type : 'user'
            },
        }, (resp) => {
            if (resp.status == 1) {
                setUserList(resp.users)
                setCount(resp.totalRecords)
                setLoading(false)
            }

        })
    }


    function createData(id, firstname, lastname, email, status, plan,) {
        return { id, firstname, lastname, email, status, plan, };
    }

    const rows = userList.map((val) => createData(val._id, val.firstname, val.lastname, val.email, val.status, val.plan),
    ).sort((a, b) => (a.is < b.id ? -1 : 1));


    const emptyRows =searchTerm ? Math.max(0, count - page * rowsPerPage) : Math.max(0, rowsPerPage - rows.length);

    const handleChangePage = (event, newPage) => {
        fetchUser(searchTerm, newPage, rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        fetchUser(searchTerm, page, parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //user restore option 
    const restore = (id) => {
        if (id) {
            callAPI({
                method: 'PUT',
                url: `common/trash`,
                data : {
                    id : id,
                    type : 'user'
                }
            }, (resp) => {
                if (resp.status == 1) {
                    setRestorePopUp(false);
                    fetchUser();
                }
            })
        }
    }

    const handleRestore = (id) => {
        setRestorePopUp(true);
        setRestoreId(id);
    }

    const handleRestorePopUp = (val) => {
        if (val) {
            restore(restoreId);
        }
        setRestorePopUp(false);
    }

    const restorePopupCloseHandler = () => { setRestoreId(''); setRestorePopUp(false); }

    // User delete function
    const deleteUser = (id) => {
        if (id) {
            callAPI({
                method: 'DELETE',
                url: `admin/users?id=${id}`,
            }, (resp) => {
                if (resp.status == 1) {
                    setShowPopup(false);
                    fetchUser();
                }
            })
        }
    }

    const handleDelete = (id) => {
        setShowPopup(true);
        setDeleteId(id);
    }

    const handlePopUp = (val) => {
        if (val) {
            deleteUser(DeleteId);
        }
        setShowPopup(false);
    }

    const deletePopupCloseHandler = () => { setDeleteId(''); setShowPopup(false); }

    return (
        <div>
            <PageTitle title="Trash" />
            <div className='content_wrapper'>
               {(rows.length != 0) && <div className='box_wrap'>
                    <Box className="search_wrapper">
                        <span className="search_icon">{svg.search}</span>
                        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
                        {searchTerm ?
                            <span className="search_clear" onClick={(e) => clearSearch(e)}>x</span>
                            : null
                        }
                    </Box>

                </div>
                }
                <div className='datatable_wrap'>
                    
                        <Suspense >
                           

                            <TableContainer component={Paper} className='table_container'>
                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {(rows.length == 0 && !loading) ? null :  <TableHead className='table_head'>
                                        <TableRow>
                                            <TableCell className='table_head'>S.No</TableCell>
                                            <TableCell align="left" className='table_head'>Name</TableCell>
                                            <TableCell align="left" className='table_head'>Email</TableCell>
                                            <TableCell align="left" className='table_head'>Status</TableCell>
                                            <TableCell align="left" className='table_head'>Plan</TableCell>
                                            <TableCell align="left" className='table_head'>Actions</TableCell>

                                        </TableRow>
                                    </TableHead>}

                                    <>
                                        <TableBody className='table_body'>

                                        {loading ? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader/></TableCell></TableRow>
                                            :
                                            rows.map((row, i) => (
                                                <TableRow key={row.id} className='table_row'>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {(rowsPerPage * page) + (i + 1)}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        <span> {row.firstname} {row.lastname}</span>

                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {row.email}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {row.status == 'Active' ?
                                                            <div className='status_btn active'>{row.status}</div> :
                                                            <div className='status_btn inactive'>{row.status}</div>
                                                        }
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        {row.plan ? row.plan.planname : '-'}
                                                    </TableCell>
                                                    <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                        <div className='table_action_wrap'>
                                                        <Tooltip title="Restore User" placement="top" arrow>
                                                            <div className="action_edit" onClick={() => handleRestore(row.id)}>{svg.restore}</div>
                                                            </Tooltip>
                                                            <Tooltip title="Detete User Parmanently" placement="top" arrow>
                                                            <div className="action_delete" onClick={() => handleDelete(row.id)}>{svg.delete}</div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                           
                                            
                                        </TableBody>
                                        {!loading && (rows.length != 0) ? <TableFooter>
                                            <TableRow >
                                                <TablePagination className='table_footer'
                                                    rowsPerPageOptions={[ 10, 25,50, 100]}
                                                    colSpan={6}
                                                    count={count}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                        inputProps: {
                                                            'aria-label': 'rows per page',
                                                        },
                                                        native: true,
                                                    }}
                                                    onPageChange={handleChangePage}
                                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                                    ActionsComponent={TablePaginationActions}
                                                />
                                            </TableRow>
                                        </TableFooter> : ""}
                                    </>

                                </Table>
                            </TableContainer>

                            

                        </Suspense>
                        {!loading && (rows.length == 0) ? (<div className='empty_box'><span>{svg.empty_record}</span>
                                            <p className='empty_p'>Trash is empty. </p> </div>
                                           ) : ''}
                </div>

            </div>

{/* Delete popoup */}
            <Popup
                heading={"Delete permanently"}
                show={showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>
        
{/* Restore popoup */}

            <Popup
                heading={"Restore"}
                show={restorePopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={restorePopupCloseHandler}
            >
                <ConfirmRestorePopup handlePopUp={handleRestorePopUp} name="this user" />
            </Popup>

{/* Empty popoup */}
{/* 
            <Popup
                heading={"Empty Trash"}
                show={emptyPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={trashPopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handleTrashPopUp} title=" parmanently" />
            </Popup> */}

        </div >
    )
}

export default page
