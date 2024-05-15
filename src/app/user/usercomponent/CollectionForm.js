"use client"

import styles from '@/style/campaign.module.css'
import { Form } from '@/utils/formValidator';
import { Chip, Skeleton, Tooltip } from "@mui/material";
import { Table, TableHead, Paper, TableRow, TableCell, TableBody, TableContainer } from '@mui/material';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import svg from "@/utils/svg"
import Popup from '@/app/components/popup/popup';
import ConfirmDeletePopup from '@/app/components/popup/deleteConfirm';
import { toast } from 'react-toastify';
import { callAPI } from '@/utils/API';

export function StaffCollectionForm(props) {

    const [staffValue, setStaffValue] = useState({ name: "", designation: "", service: "" });
    const [staffList, setStaffList] = useState([])
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setStaffList(props.staffList);
    }, [props.staffList])

    const handleInputChange = (e) => {
        setStaffValue((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    }
    const handleAddStaff = () => {
        const errorsMess = {};
        if (!staffValue.name) {
            errorsMess.name = 'Name is required.';
        }
        if (!staffValue.designation) {
            errorsMess.designation = 'Designation is required.';
        }
        if (!staffValue.service) {
            errorsMess.service = 'Service is required.';
        }
        if (Object.keys(errorsMess).length > 0) {
            setErrors(errorsMess);
        } else {
            setErrors({});
            setStaffList(prev => {
                return [...prev, staffValue];
            })
            props.addStaff([...staffList, staffValue]);
            setStaffValue({ name: "", designation: "", service: "" });
        }
    }

    // Delete Staff Handle

    const deletePopupCloseHandler = () => { setDeletePopUp(false); }


    const handleDelete = (id) => {
        setDeletePopUp(true);
        setSelectedId(id)
    }

    const handlePopUp = (val) => {
        if (val) {
            let updatedStaffList = [...staffList]
            updatedStaffList = updatedStaffList.filter((item, index) => {
                return index != selectedId;
            });
            setStaffList(updatedStaffList);
            props.addStaff(updatedStaffList);
        }
        setDeletePopUp(false);
        setSelectedId('')
    }

    const editStaff = () => {
        const errorsMess = {};
        if (!staffValue.name) {
            errorsMess.name = 'This field is required.';
        }
        if (!staffValue.designation) {
            errorsMess.designation = 'This field is required.';
        }
        if (!staffValue.service) {
            errorsMess.service = 'This field is required.';
        }
        if (Object.keys(errorsMess).length > 0) {
            setErrors(errorsMess);
        } else {
            setErrors({});
            const updatedStaffList = [...staffList];
            const indexToUpdate = selectedId;
            updatedStaffList[indexToUpdate] = staffValue;
            props.addStaff(updatedStaffList);
            setIsEdit(false)
            setStaffList(updatedStaffList);
            setStaffValue({ name: "", designation: "", service: "" });
        }
    }

    return (
        <>
            <div className={styles.staff_input_wrap}>
                <div className="input_wrapper">
                    <label>Staff Name</label>
                    <input type='text' name="name" className="input" value={staffValue.name} placeholder={`Enter staff name`} onChange={handleInputChange} />
                    {errors.name && <span className='error'>{errors.name}</span>}
                </div>
                <div className="input_wrapper">
                    <label>Designation</label>
                    <input type='text' name="designation" className="input" value={staffValue.designation} placeholder={`Enter designation`} onChange={handleInputChange} />
                    {errors.designation && <span className='error'>{errors.designation}</span>}
                </div>
                <div className="input_wrapper">
                    <label>Service</label>
                    <input type='text' name="service" className="input" value={staffValue.service} placeholder={`Enter service`} onChange={handleInputChange} />
                    {errors.service && <span className='error'>{errors.service}</span>}
                </div>
                {isEdit ? <button type='button' className="ap_btn" onClick={editStaff} >Update</button> : <button type='button' className="ap_btn" onClick={handleAddStaff} >Add</button>}
            </div>
            <div>
                <div className={staffList.length ? 'datatable_wrap pay_table' : 'hide'}>


                    <TableContainer component={Paper} className='table_container'>
                        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                            <TableHead className='table_head'>
                                <TableRow>
                                    <TableCell className='table_head'>S.No</TableCell>
                                    <TableCell align="left" className='table_head'>Staff Name</TableCell>
                                    <TableCell align="left" className='table_head'>Designation</TableCell>
                                    <TableCell align="left" className='table_head'>Service</TableCell>
                                    <TableCell align="left" className='table_head'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <>
                                <TableBody className='table_body'>
                                    {staffList.map((row, i) => (
                                        <TableRow className='table_row' key={i}>
                                            <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                {i + 1}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                {row.name}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                {row.designation}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                {row.service}
                                            </TableCell>
                                            <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                                <div className='table_action_wrap'>
                                                    <Tooltip title="Edit" placement="top" arrow>
                                                        <div className="action_edit" onClick={() => { setStaffValue(row); setIsEdit(true); setSelectedId(i) }}>{svg.edit}</div>
                                                    </Tooltip>
                                                    <Tooltip title="Delete" placement="top" arrow>
                                                        <div className="action_delete" onClick={() => handleDelete(i)} >{svg.delete}</div>
                                                    </Tooltip>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </>
                        </Table>
                    </TableContainer>



                </div>
            </div>
            <Popup
                heading={"Delete Staff"}
                show={deletePopUp}
                maxWidth={'440px'}
                type="delete"
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

        </>
    )
}


export function InputFieldsForm(props) {

    const [inpOptionField, setInpOptionField] = useState('');
    const [optionsList, setOptionsList] = useState([]);
    const [error, setError] = useState('')
    const { register, handleSubmit, formState: { errors }, reset, control, watch } = useForm({
        defaultValues: {
            inputType: 'text',
            label: ''
        }
    });
    useEffect(() => {
        reset();
        setOptionsList([])
    }, [])

    const AddInputField = (updatedval) => {

        if (updatedval.label) {
            if (updatedval.inputType == "radio" || updatedval.inputType == "select" || updatedval.inputType == "groupCheckBox") {
                if (optionsList.length) {
                    updatedval.options = optionsList;
                    props.handleAddInputField(updatedval)
                    setOptionsList([]);
                    setInpOptionField('')
                    reset();
                } else {
                    setError("Options are required.")
                }
            } else {

                props.handleAddInputField(updatedval)
                setOptionsList([]);
                setInpOptionField('')
                reset();
            }

        }
    }

    const handleAddInputOptionFields = () => {
        if (inpOptionField) {
            setOptionsList(prev => {
                return [...prev, inpOptionField];
            })
            setInpOptionField('')
        } else {
            setError("Options are required.")
        }
    }

    const handleDelete = (chipToDelete) => () => {
        setOptionsList((chips) => chips.filter((chip) => chip !== chipToDelete));
        setInpOptionField('')
    }

    return (
        <>
            <form onSubmit={handleSubmit(AddInputField)} >

                <Form fieldname='label' label='Label' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />

                <Form fieldname="inputType" label={"Input Type"} inputType={"select"} options={[{ label: 'Text', value: 'text' }, { label: 'Email', value: 'email' }, { label: 'Number', value: 'number' }, { label: 'Textarea', value: 'textarea' }, { label: 'Select', value: 'select' }, { label: 'Radio', value: 'radio' }, { label: 'Checkbox', value: 'checkbox' }, { label: 'Password', value: 'password' }, { label: 'Phone', value: 'tel' }, { label: 'Date', value: 'date' }, { label: 'Group CheckBox', value: 'groupCheckBox' }]} control={control} errors={errors} />

                {(watch("inputType") == "radio" || watch("inputType") == "groupCheckBox" || watch("inputType") == "select") && (
                    <div>
                        <div className={styles.staff_input_wrap}>
                            <div className="input_wrapper flex-1">
                                <label>Option</label>
                                <input type='text' name="option" className="input" value={inpOptionField} placeholder={`Enter Option`} onChange={(e) => { setInpOptionField(e.target.value); setError('') }} />
                                {(error) && <span className='error'>{error}</span>}

                            </div>
                            <button type='button' className="ap_btn" onClick={handleAddInputOptionFields} >Add</button>
                        </div>
                        <div className='mb'>
                            {optionsList.map((option, i) => <Chip key={i}
                                label={option}
                                onDelete={handleDelete(option)}
                                sx={{ margin: "5px" }}
                            />)}
                        </div>
                    </div>
                )}

                <div className="text-center">
                    <button type="submit" className="ap_btn ap_btn_full" >Add Field</button>
                </div>
            </form>
        </>
    )
}


export function ReservationType(props) {
    const { register, formState: { errors }, reset, control, trigger, getValues, setValue } = useForm();
    const [tableTypeList, settableTypeList] = useState([])
    const [roomTypeList, setRoomTypeList] = useState([])
    const [seatTypeList, setSeatTypeList] = useState([])
    const [tablehead, setTableHead] = useState([]);
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [attachmentFileURL, setAttachmentFileURL] = useState([]);
    const [attachFile, setAttachFile] = useState([]);
    const [imageRemove, setImageRemove] = useState({ show: false, url: '' });
    const [ImagePreview, setImagePreview] = useState({ show: false, url: '' });
    const [imageErr, setImageErr] = useState(false);
    const [editId, setEditId] = useState('');
    const [imgLoader, setImageLoader] = useState(false);


    useEffect(() => {
        if (props.type == "Seat") {
            setTableHead(["Name", "Price", "Seats", "Description "])
            setSeatTypeList(props.seat);
        } else if (props.type == "Table") {
            setTableHead(["Name", "Price", "Tables", "Table", "Description"])
            settableTypeList(props.table)
        } else if (props.type == "Room") {
            setTableHead(["Name", "Price", "Rooms", "Persons", "Description"])
            setRoomTypeList(props.room);
        }
    }, [])

    const handleAddReservation = () => {
        trigger().then((isValid) => {
            if (isValid) {
                const name = getValues("name")
                const price = getValues("price")
                const description = getValues("description")
                if (props.type == "Seat") {
                    const numberOfSeats = getValues("numberOfSeats")
                    if (isEdit) {
                        const updatedseatTypeList = [...seatTypeList];
                        const indexToUpdate = selectedId;
                        updatedseatTypeList[indexToUpdate] = {
                            "name": name,
                            "price": price,
                            "description": description,
                            "numberOfSeats": numberOfSeats,
                            'id': editId
                        };

                        props.addReservationType(updatedseatTypeList);
                        setSeatTypeList(updatedseatTypeList);
                    } else {
                        setSeatTypeList(prev => {
                            return [...prev, {
                                "name": name,
                                "price": price,
                                "description": description,
                                "numberOfSeats": numberOfSeats
                            }];
                        }
                        )
                        props.addReservationType([...seatTypeList, {
                            "name": name,
                            "price": price,
                            "description": description,
                            "numberOfSeats": numberOfSeats
                        }]);
                    }
                    reset()
                }
                if (props.type == "Table") {
                    const numberOfTables = getValues("numberOfTables")
                    const personPerTable = getValues("personPerTable")

                    if (isEdit) {
                        const updatedtableTypeList = [...tableTypeList];
                        const indexToUpdate = selectedId;
                        updatedtableTypeList[indexToUpdate] = {
                            "name": name,
                            "price": price,
                            "description": description,
                            "numberOfTables": numberOfTables,
                            "personPerTable": personPerTable,
                            'id': editId
                        };

                        props.addReservationType(updatedtableTypeList);
                        settableTypeList(updatedtableTypeList);
                    } else {
                        settableTypeList(prev => {
                            return [...prev, {
                                "name": name,
                                "price": price,
                                "description": description,
                                "numberOfTables": numberOfTables,
                                "personPerTable": personPerTable
                            }];
                        }
                        )
                        props.addReservationType([...tableTypeList, {
                            "name": name,
                            "price": price,
                            "description": description,
                            "numberOfTables": numberOfTables,
                            "personPerTable": personPerTable
                        }]);
                    }
                    reset()
                }
                if (props.type == "Room") {
                    if (attachmentFileURL.length == 0) {
                        setImageErr(true);
                    } else {
                        const numberOfRooms = getValues("numberOfRooms")
                        const personPerRoom = getValues("personPerRoom")
                        if (isEdit) {
                            const updatedroomTypeList = [...roomTypeList];
                            const indexToUpdate = selectedId;
                            updatedroomTypeList[indexToUpdate] = {
                                "name": name,
                                "price": price,
                                "description": description,
                                "numberOfRooms": numberOfRooms,
                                "personPerRoom": personPerRoom,
                                "images": attachFile,
                                'id': editId
                            };

                            props.addReservationType(updatedroomTypeList);
                            setRoomTypeList(updatedroomTypeList);
                            setAttachmentFileURL([])
                            setAttachFile([])
                        } else {
                            setRoomTypeList(prev => {
                                return [...prev, {
                                    "name": name,
                                    "price": price,
                                    "description": description,
                                    "numberOfRooms": numberOfRooms,
                                    "personPerRoom": personPerRoom,
                                    "images": attachFile
                                }];
                            }
                            )
                            props.addReservationType([...roomTypeList, {
                                "name": name,
                                "price": price,
                                "description": description,
                                "numberOfRooms": numberOfRooms,
                                "personPerRoom": personPerRoom,
                                "images": attachFile
                            }]);
                            setAttachmentFileURL([])
                            setAttachFile([])
                        }
                        reset()
                    }
                }
                setIsEdit(false)
                setEditId('');
                setEditId('');

            }
        })

    }

    // Delete Staff Handle

    const deletePopupCloseHandler = () => { setDeletePopUp(false); setImageRemove({ show: false, url: '' }); setImagePreview({ show: false, url: '' }) }


    const handleDelete = (id) => {
        setDeletePopUp(true);
        setSelectedId(id)
    }

    const handlePopUp = (val) => {
        if (val) {
            if (props.type == "Seat") {
                let updatedseatTypeList = [...seatTypeList]
                updatedseatTypeList = updatedseatTypeList.filter((item, index) => {
                    return index != selectedId;
                });
                setSeatTypeList(updatedseatTypeList);
                props.addReservationType(updatedseatTypeList);
            }
            if (props.type == "Table") {
                let updatedtableTypeList = [...tableTypeList]
                updatedtableTypeList = updatedtableTypeList.filter((item, index) => {
                    return index != selectedId;
                });
                settableTypeList(updatedtableTypeList);
                props.addReservationType(updatedtableTypeList);

            }
            if (props.type == "Room") {
                let updatedroomTypeList = [...roomTypeList];

                let deleteRoom = updatedroomTypeList.find((item, index) => {
                    return index == selectedId;
                });
                const isFile = (obj) => obj instanceof File;

                const imageType = (deleteRoom.images).filter((item) => !isFile(item));

                if(imageType.length > 0)
                {
                    callAPI({
                        method: 'DELETE',
                        url: `user/image`,
                        data: imageType
                    }, (resp) => {
                        if (resp.status == 1) {
                            updatedroomTypeList = updatedroomTypeList.filter((item, index) => {
                                return index != selectedId;
                            });
                            setRoomTypeList(updatedroomTypeList);
                            props.addReservationType(updatedroomTypeList);
                        }
                    })
                }
                else{
                    updatedroomTypeList = updatedroomTypeList.filter((item, index) => {
                        return index != selectedId;
                    });
                    setRoomTypeList(updatedroomTypeList);
                    props.addReservationType(updatedroomTypeList);
                }
            }
        }
        setDeletePopUp(false);
        setSelectedId('')
    }


    // Edit COde Start 
    const handleEdit = (id, data) => {

        setIsEdit(true);
        setEditId(data.id)
        setSelectedId(id)
        if (props.type == "Seat") {
            setValue("name", data.name)
            setValue("price", data.price)
            setValue("description", data.description)
            setValue("numberOfSeats", data.numberOfSeats)
        }
        if (props.type == "Table") {
            setValue("name", data.name)
            setValue("price", data.price)
            setValue("description", data.description)
            setValue("numberOfTables", data.numberOfTables)
            setValue("personPerTable", data.personPerTable)
        }
        if (props.type == "Room") {
            setAttachmentFileURL([])
            setValue("name", data.name)
            setValue("price", data.price)
            setValue("description", data.description)
            setValue("numberOfRooms", data.numberOfRooms)
            setValue("personPerRoom", data.personPerRoom);
            getImage(data.images);
            setAttachFile(data.images);
        }
    }

    const getImage = (data) => {
        setImageLoader(true);
        let haveId;
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] === "string") {
                haveId = true
            } else {
                const url = URL.createObjectURL(data[i]);
                setAttachmentFileURL(current => [...current, url]);
                setImageLoader(false)
            }
        }

        if (haveId) {
            callAPI({
                method: 'GET',
                url: `user/image?id=${props.campaignid}`,
            }, (resp) => {
                if (resp.status == 1) {
                    setImageLoader(false);
                    const matchedImages = resp.camp_images.filter(item => data.includes(item._id));
                    const imageUrls = matchedImages.map(item => item.image);
                    setAttachmentFileURL((current) => [...current, ...imageUrls])
                }
            })
        }
    }
    // File Attachment with mess 
    const attachmentFile = (event) => {
        const file = event.target.files[0];
        setImageErr(false);
        if (file) {
            if (file.type.includes('image/')) {
                const url = URL.createObjectURL(file);
                setAttachmentFileURL(current => [...current, url]);
                setAttachFile(current => [...current, file]);
            } else {
                toast.error('Only PNG and JPG are allowed!', { theme: "colored" });
            }
        }
    }

    const containsBlob = (str) => str.includes('blob');

    // REmove Image Handling

    const handleRemoveImage = (val) => {
        if (val) {

            let indexToRemove = attachmentFileURL.indexOf(imageRemove.url);
            let deleteimageid = attachFile.find((data, index) => index == indexToRemove);

            const isFile = (obj) => obj instanceof File;


            if(! isFile(deleteimageid)){
                try {
                    callAPI({
                        method: 'DELETE',
                        url: `user/image?id=${deleteimageid}`,
                    }, (resp) => {
                        if (resp.status == 1) {
                            setAttachmentFileURL(current =>
                                current.filter(data => {
                                    return data !== imageRemove.url;
                                }))
    
                            setAttachFile(current =>
                                current.filter(data => {
                                    return attachFile.indexOf(data) !== indexToRemove;
                                }))
                        }
                    })
    
                } catch (error) {
                    throw error.message;
                }
            }
            else{
                setAttachmentFileURL(current =>
                    current.filter(data => {
                        return data !== imageRemove.url;
                    }))

                setAttachFile(current =>
                    current.filter(data => {
                        return attachFile.indexOf(data) !== indexToRemove;
                    }))
            }

           
            setImageRemove({ show: false, url: '' })
        } else {
            setImageRemove({ show: false, url: '' })
        }
    }

    return (
        <>
            <div>


                <h4 className={styles.custom_label}>{props.type} Types {props.emptyError && <span className='error mb'>Please add atleast one {props.type} reservation type.</span>}</h4>
                <div className='input_wrapper_list'>
                    <Form fieldname="name" label={`Name`} inputType='text' register={register} errors={errors} isRequired={true} />
                    <Form fieldname='price' label={`Price`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={true} />
                </div>
                <div className='input_wrapper_list'>
                    {(props.type == "Seat") && <Form fieldname='numberOfSeats' label={`Number Of Seats`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />}

                    {(props.type == "Table") && <><Form fieldname='numberOfTables' label={`Number Of Tables`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                        <Form fieldname='personPerTable' label={`Person Per Table`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                    </>}

                    {(props.type == "Room") && <> <Form fieldname='numberOfRooms' label={`Number Of Rooms`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                        <Form fieldname='personPerRoom' label={`Person Per Room`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                    </>
                    }
                </div>

                <Form fieldname='description' label={`Description `} inputType='textarea' register={register} errors={errors} isRequired={true} />

                {(props.type == "Room") && <div className={styles.Editor_Attachment_section}>
                    <label>Room Image <span className='bhub_required'>*</span></label>
                    <div className={styles.attach_file_outer_box}>
                        <div className={styles.attach_file_box}>
                            <label>
                                <input type="file" onChange={(e) => { attachmentFile(e); e.target.value = ''; }} accept=".png,.jpg, .jpeg" />
                                <div className={styles.attach_file_label}>
                                    <p>+</p>
                                </div>
                            </label>
                        </div>

                        {imgLoader ? [...Array(2)].map((val) => <Skeleton variant="rounded" width={78} height={80} key={val} className='mt-4'/>) :
                            attachmentFileURL ?
                                attachmentFileURL.map(url => <div className={styles.attach_file_box} key={url}>
                                    <Tooltip title="Click to preview" placement="top" arrow>
                                        <label onClick={() => setImagePreview({ show: true, url: url })}>
                                            <div className={styles.file_preview}>
                                                {
                                                    (containsBlob(url)) ? <img src={url} alt="" /> : <img src={url} alt="" />
                                                }

                                            </div>
                                        </label>
                                    </Tooltip>
                                    <Tooltip title="Remove" placement="top" arrow>
                                        <span className="remove_icon" onClick={() => setImageRemove({ show: true, url: url })}></span>
                                    </Tooltip>

                                </div>) : null
                        }

                    </div>
                    {(imageErr) && <span className='error'>Please add image.</span>}
                </div>
                }

                {isEdit ? <button type='button' className="ap_btn" onClick={handleAddReservation} >Update</button> : <button type='button' className="ap_btn" onClick={handleAddReservation} >Add</button>}
            </div>


            <div className={(seatTypeList.length || tableTypeList.length || roomTypeList.length) ? 'datatable_wrap pay_table ' : 'hide'}>


                <TableContainer component={Paper} className='table_container'>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead className='table_head'>
                            <TableRow>
                                <TableCell className='table_head'>S.No</TableCell>
                                {
                                    tablehead.map(val => <TableCell align="left" key={val} className='table_head'>{val}</TableCell>)
                                }
                                <TableCell className='table_head'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <>
                            <TableBody className='table_body'>
                                {(props.type == "Seat") && seatTypeList.map((row, i) => (
                                    <TableRow className='table_row' key={i}>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.price}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.numberOfSeats}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row?.description.length > 10 ? <Tooltip title={row.description} placement="top" arrow>  {`${row.description.slice(0, 10)}...`} </Tooltip> : row.description}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <div className='table_action_wrap'>
                                                <div className="action_edit" onClick={() => handleEdit(i, row)}>{svg.edit}</div>
                                                <div className="action_delete" onClick={() => handleDelete(i)} >{svg.delete}</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(props.type == "Table") && tableTypeList.map((row, i) => (
                                    <TableRow className='table_row' key={i}>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.price}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.numberOfTables}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.personPerTable}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <Tooltip title={row.description} placement="top" arrow>{row.description.length > 10 ? `${row.description.slice(0, 10)}...` : row.description}</Tooltip>
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <div className='table_action_wrap'>
                                                <div className="action_edit" onClick={() => handleEdit(i, row)}>{svg.edit}</div>
                                                <div className="action_delete" onClick={() => handleDelete(i)} >{svg.delete}</div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(props.type == "Room") && roomTypeList.map((row, i) => (
                                    <TableRow className='table_row' key={i}>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.price}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.numberOfRooms}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.personPerRoom}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <Tooltip title={row.description} placement="top" arrow>  {row.description.length > 10 ? `${row.description.slice(0, 10)}...` : row.description}</Tooltip>
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <div className='table_action_wrap'>
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <div className="action_edit" onClick={() => handleEdit(i, row)}>{svg.edit}</div>
                                                </Tooltip>
                                                <Tooltip title="Delete" placement="top" arrow>
                                                    <div className="action_delete" onClick={() => handleDelete(i)} >{svg.delete}</div>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </>
                    </Table>
                </TableContainer>



            </div>




            <Popup
                heading={"Delete Reservation Type"}
                show={deletePopUp}
                maxWidth={'440px'}
                type="delete"
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

            {/* Remove Image COnfirmation Popup */}

            <Popup
                heading={"Remove Image"}
                show={imageRemove.show}
                maxWidth={'440px'}
                type="delete"
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handleRemoveImage} title=" parmanently" />
            </Popup>
            <Popup
                show={ImagePreview.show}
                maxWidth={'640px'}
                onClose={deletePopupCloseHandler}
            >
                <div>
                    {
                        (containsBlob(ImagePreview.url)) ? <img src={ImagePreview.url} alt="" style={{ width: '100%' }} /> : <img src={ImagePreview.url} alt="" style={{ width: '100%' }} />
                    }

                </div>
            </Popup>

        </>
    )

}




export function TicketTypes(props) {
    const { register, formState: { errors }, reset, control, watch, getValues, setValue, setError, trigger } = useForm({ defaultValues: { ticket_type: '' } });
    const [ticketTypeList, setTicketTypeList] = useState([])
    const [tablehead, setTableHead] = useState(["Title", "Available", "Ticket Fee", "Description"]);
    const [deletePopUp, setDeletePopUp] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState('');

    useEffect(() => {
        setTicketTypeList(props.ticketList);
    }, [props.ticketList])

    const submitTicketType = () => {

        trigger().then((isValid) => {
            if (isValid) {
                const title = getValues("title");
                const price = getValues("price");
                const description = getValues("description");
                const numberOfTickets = getValues("numberOfTickets");
                const ticketType = getValues("ticket_type")

                if (isEdit) {
                    const updatedticketTypeList = [...ticketTypeList];
                    const indexToUpdate = selectedId;
                    updatedticketTypeList[indexToUpdate] = {
                        "title": title,
                        "price": ticketType == 'free' ? 0 : price,
                        "description": description,
                        "numberOfTickets": numberOfTickets,
                        'ticket_type': ticketType,
                        'id': editId
                    };

                    props.addTicketType(updatedticketTypeList);
                    setTicketTypeList(updatedticketTypeList);
                } else {
                    setTicketTypeList(prev => {
                        return [...prev, {
                            "title": title,
                            'ticket_type': ticketType,
                            "price": ticketType == 'free' ? 0 : price,
                            "description": description,
                            "numberOfTickets": numberOfTickets
                        }];
                    }
                    )
                    props.addTicketType([...ticketTypeList, {
                        "title": title,
                        "price": ticketType == 'free' ? 0 : price,
                        'ticket_type': ticketType,
                        "description": description,
                        "numberOfTickets": numberOfTickets
                    }]);
                }
                setIsEdit(false)
                setEditId('')
                reset();
            }
        });

    }

    // Delete  Handle

    const deletePopupCloseHandler = () => { setDeletePopUp(false); }


    const handleDelete = (id) => {
        setDeletePopUp(true);
        setSelectedId(id)
    }

    const handlePopUp = (val) => {
        if (val) {
            let updatedticketTypeList = [...ticketTypeList]
            updatedticketTypeList = updatedticketTypeList.filter((item, index) => {
                return index != selectedId;
            });
            setTicketTypeList(updatedticketTypeList);
            props.addTicketType(updatedticketTypeList);

        }
        setDeletePopUp(false);
        setSelectedId('')
    }


    // Edit COde Start 
    const handleEdit = (id, data) => {
        setIsEdit(true);
        setSelectedId(id);
        setValue("title", data.title)
        setValue("numberOfTickets", data.numberOfTickets)
        setValue("description", data.description)
        setValue("ticket_type", data.ticket_type)
        setValue("price", data.price);
        setEditId(data.id)
    }

    return (
        <>


            <div className={styles.formWrapper}>

                <div>
                    <div className='input_wrapper_list'>
                        <Form fieldname="title" label={`Ticket Title`} inputType='text' register={register} errors={errors} isRequired={true} />
                        <Form fieldname='numberOfTickets' label={`Total Tickets`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                    </div>

                    <div>
                        <Form fieldname="description" label={`Description`} inputType='textarea' register={register} errors={errors} isRequired={true} />
                    </div>
                    <div className='input_wrapper_list'>
                        <Form fieldname={'ticket_type'} label={'Ticket Type'} inputType={"radio"} options={[{ label: 'Paid', value: 'paid' }, { label: 'Free', value: 'free' }]} control={control} errors={errors} isRequired={true} />
                        {watch('ticket_type') == 'paid' && <Form fieldname='price' label={`Ticket Fee`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={true} />
                        }
                    </div>
                </div>

                {isEdit ? <button type='button' className="ap_btn" onClick={submitTicketType} >Update</button> : <button type='button' className="ap_btn" onClick={submitTicketType} >Add</button>}
            </div>


            <div className={(ticketTypeList.length) ? 'datatable_wrap pay_table ' : 'hide'}>


                <TableContainer component={Paper} className='table_container'>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead className='table_head'>
                            <TableRow>
                                <TableCell className='table_head'>S.No</TableCell>
                                {
                                    tablehead.map(val => <TableCell key={val} align="left" className='table_head'>{val}</TableCell>)
                                }
                                <TableCell className='table_head'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <>
                            <TableBody className='table_body'>
                                {ticketTypeList.map((row, i) => (
                                    <TableRow className='table_row' key={i}>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.title}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.numberOfTickets}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row.price ? row.price : 'Free'}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            {row?.description.length > 10 ? <Tooltip title={row.description} placement="top" arrow>  {`${row.description.slice(0, 10)}...`} </Tooltip> : row.description}
                                        </TableCell>
                                        <TableCell style={{ width: 160 }} align="left" className='table_data'>
                                            <div className='table_action_wrap'>
                                                <Tooltip title="Edit" placement="top" arrow>
                                                    <div className="action_edit" onClick={() => handleEdit(i, row)}>{svg.edit}</div>
                                                </Tooltip>
                                                <Tooltip title="Delete" placement="top" arrow>
                                                    <div className="action_delete" onClick={() => handleDelete(i)} >{svg.delete}</div>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </>
                    </Table>
                </TableContainer>



            </div>

            <Popup
                heading={"Delete Ticket type"}
                show={deletePopUp}
                maxWidth={'440px'}
                type="delete"
                onClose={deletePopupCloseHandler}
            >
                <ConfirmDeletePopup handlePopUp={handlePopUp} title=" parmanently" />
            </Popup>

        </>
    )

}