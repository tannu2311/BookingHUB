"use client"
import PageTitle from '@/app/components/common/PageTitle'
import svg from '@/utils/svg';
import { Box, CircularProgress, Tooltip } from '@mui/material'
import { useState, useEffect, Suspense } from 'react';
import { Table, TableHead, Paper, TableRow, Skeleton, Button, TableCell, TableBody, TablePagination, TableFooter, TableContainer } from '@mui/material';
import { callAPI } from '@/utils/API'
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { TablePaginationActions } from '@/app/components/common/TablePagination';
import DatatableLoader from '@/app/components/loader/DatatableLoader';

function page() {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [msgList, setmsgList] = useState([]);
    const [DeleteId, setDeleteId] = useState();
    const [showPopUp, setShowPopup] = useState(false);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('');


    let clearSearch = (e) => {
        setSearchTerm('');
        fetchMsg('')
    }

    const handleSearchKeyupEvent = async (e) => {
        let t = e.target;
        let searchTerm = t.value;
        setSearchTerm(searchTerm);

        if (e.keyCode === 13) {
            fetchMsg(searchTerm)
        }
    }

    useEffect(() => {
        fetchMsg();
    }, [page, rowsPerPage])


    const fetchMsg = (search = searchTerm, pageNo = page, row = rowsPerPage) => {
        setLoading(true)

        callAPI({
            method: 'PUT',
            url: 'contactFormMessage',
            data: {
                search: search,
                page: pageNo + 1,
                listPerPage: row
            },
        }, (resp) => {
            if (resp.status == 1) {
                setmsgList(resp.messages)
                setCount(resp.totalRecords)
                setLoading(false)
            }

        })
    }

    const handleChangePage = (event, newPage) => {
        fetchMsg(searchTerm, newPage, rowsPerPage)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        fetchMsg(searchTerm, page, parseInt(event.target.value, 10))
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // delete
    const deleteMsg = (id) => {
        if (id) {
            callAPI({
                method: 'DELETE',
                url: `contactFormMessage?id=${id}`,
            }, (resp) => {
                if (resp.status == 1) {
                    setShowPopup(false);
                    fetchMsg();
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
            deleteMsg(DeleteId);
        }
        setShowPopup(false);
    }

    const deletePopupCloseHandler = () => { setDeleteId(''); setShowPopup(false); }


    return (
        <div>
            <PageTitle title="Contact Form Messages" />
            <div className='content_wrapper'>
                <div className='box_wrap'>
                    <Box className="search_wrapper">
                        <span className="search_icon">{svg.search}</span>
                        <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyUp={handleSearchKeyupEvent} />
                        {searchTerm ?
                            <span className="search_clear" onClick={(e) => clearSearch(e)}>x</span>
                            : null
                        }
                    </Box>

                </div>

                <div className='datatable_wrap'>

                    <Suspense >
                       <TableContainer component={Paper} className='table_container'>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                {(msgList && msgList.length == 0 && !loading) ? null : <TableHead className='table_head'>
                                    <TableRow>
                                        <TableCell className='table_head'>S.No</TableCell>
                                        <TableCell align="left" className='table_head'>Name</TableCell>
                                        <TableCell align="left" className='table_head'>Email</TableCell>
                                        <TableCell align="left" className='table_head'>Subject</TableCell>
                                        <TableCell align="left" className='table_head'>Message</TableCell>
                                        <TableCell align="left" className='table_head'>Delete</TableCell>
                                    </TableRow>
                                </TableHead>}

                                <>
                                    <TableBody className='table_body'>

                                        {msgList && loading? <TableRow><TableCell align="center" className='table_data' colSpan={6}><DatatableLoader /></TableCell></TableRow>
                                            :
                                            msgList.map((row, i) => {
                                                                            
                                                return (
                                                    <TableRow key={row._id} className='table_row'>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            {(rowsPerPage * page) + (i + 1)}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <span> {row.first_name} {row.last_name}</span>

                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            {row.email}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                           
                                                            {row?.subject.length > 20 ? <Tooltip title={row.subject} placement="top" arrow>  {`${row.subject.slice(0, 20)}...`} </Tooltip> : row.subject}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                           
                                                            {row?.message.length > 20 ? <Tooltip title={row.message} placement="top" arrow>  {`${row.message.slice(0, 20)}...`} </Tooltip> : row.message}
                                                        </TableCell>
                                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                            <div className='table_action_wrap'>
                                                                <Tooltip title="Delete" placement="top" arrow>
                                                                    <div className="action_delete" onClick={() => handleDelete(row._id)}>{svg.delete}</div>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            }
                                            )}


                                    </TableBody>
                                    {!loading && (msgList.length == 0) ? null : <TableFooter>
                                        <TableRow >
                                            <TablePagination className='table_footer'
                                                rowsPerPageOptions={[10, 25, 50, 100]}
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
                                    </TableFooter>}
                                </>

                            </Table>
                        </TableContainer>


                    </Suspense>
                    {!loading && (msgList.length == 0) ? (<div className='empty_box'><span>{svg.empty_record}</span>
                        <p className='empty_p'>{searchTerm ? 'You do not have message from this user.'    :  'There are no records to display.' }</p>
                    </div>) : ''}

                </div>

            </div>

            <Popup
                heading={"Delete parmanently"}
                show={showPopUp}
                type="delete"
                maxWidth={'440px'}
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

        </div >
    )
}

export default page
