"use client"
import styles from '@/style/campaign.module.css'
import { Form } from '@/utils/formValidator';
import { Accordion, AccordionDetails, Typography, AccordionSummary, Button, ListItem, Chip, Paper, Alert } from '@mui/material';
import { useState } from 'react';
import { Calendar } from 'rsuite';
import { useForm } from "react-hook-form";
import svg from '@/utils/svg';
import { StaffCollectionForm, InputFieldsForm } from './CollectionForm';
import Popup from '@/app/components/popup/popup';
import { currencyOptions ,paypaySupportedCurrency } from '@/utils/data';
import Step3 from './Step3'; import { useEffect } from 'react';
import { callAPI } from '@/utils/API';
import { common } from '@/utils/helper';
import Link from 'next/link';
import {  useSearchParams} from "next/navigation";

function Appointment({ activeTab, handleActiveTab, campaignid, campaignStepDeatils,handleCampaignIdOnBack }) {

    const [expanded, setExpanded] = useState('panel1');
    const [BusinessDay, setBusinessDay] = useState('');
    const [paypalAccList, setPaypalAccList] = useState([]);
    const [stripAccList, setStripAccList] = useState([]);
    const [addPaymentPopUp, setAddPaymentPopUp] = useState(false);
    const[paymentMethod,setPaymentMethod] = useState('');
    const searchParams = useSearchParams();
  
    const { register, handleSubmit:handleSubmit1, formState: { errors }, reset, control, watch, trigger, setValue, setError, getValues } = useForm({
        defaultValues: {type: '',smtp_type:''}
    });
    const { register:register1,handleSubmit:handleSubmit2, formState: { errors :errors1 }, reset:reset1} = useForm();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const [selectedDates, setSelectedDates] = useState([]);
    const [staffList, setStaffList] = useState([])
    const [showInputPopUp, setShowInputPopUp] = useState(false)
    const [InputFieldList, setInputFieldList] = useState([{ inputType: 'text', label: 'Name' }, { inputType: 'email', label: 'Email' }, { inputType: 'tel', label: 'Phone' }, { inputType: 'textarea', label: 'Description' }]);
    const [hasCentralSmtpAcc,setHasCentralSmtpAcc] = useState(false);
   
   
    const paymentList = (keyword) => {
        callAPI({
            method: 'GET',
            url: `/common/paymentIntegrate?search=${keyword}`,
        }, (resp) => {
            if (keyword == 'paypal') {
                let paypalAcc = (resp.accountList).map((data) => {
                    return {
                        label: data.accountId,
                        value: data._id,

                    }
                })
                setPaypalAccList(paypalAcc);
            } else if (keyword == 'stripe') {
                let stripeAcc = (resp.accountList).map((data) => {
                    return {
                        label: data.accountId,
                        value: data._id,
                    }
                })
                setStripAccList(stripeAcc);
            }
        })
    }

     const centralSMTPDetail =() =>{
        callAPI({
            method: 'PATCH',
            url: 'common'
          }, (data) => { 
                 if(data.data.smtpDetails){ 
                    setHasCentralSmtpAcc(true);
                 }
          })
    }

    useEffect(() => {
        paymentList('paypal');
        paymentList('stripe');
        centralSMTPDetail();
          
        if (campaignStepDeatils) {

            let paypal, stripe, cash = false;
            let paypal_account, stripe_account; 
            (campaignStepDeatils.paymentMethod)  &&  (campaignStepDeatils.paymentMethod).map((method) => {
                if (method == 'paypal') {
                    paypal = true,
                        paypal_account = campaignStepDeatils?.paymentAccountId?.paypal
                }
                else if (method == 'stripe') {
                    stripe = true,
                        stripe_account = campaignStepDeatils?.paymentAccountId?.stripe
                }
                else if (method == 'cash') {
                    cash = true
                }
            })
   

            const defaultValues = {
                appointmentTimeSlot: campaignStepDeatils.appointmentTimeSlot,
                type: campaignStepDeatils.registrationType,
                currency: campaignStepDeatils.currency,
                fee: campaignStepDeatils.fee,
                paypal: paypal,
                stripe: stripe,
                cash: cash,
                paypal_account: paypal_account,
                stripe_account: stripe_account,
                smtp_type: campaignStepDeatils?.smtp_type
            };
            campaignStepDeatils.formFields && campaignStepDeatils?.formFields.forEach((field) => {
                defaultValues[field.label.split(" ").join("")] = true;
            });
            if(campaignStepDeatils?.smtp_type == "campaign"){
                defaultValues["server"] = campaignStepDeatils.smtpDetails.server;
                defaultValues["from"] = campaignStepDeatils.smtpDetails.from;
                defaultValues["port"] = campaignStepDeatils.smtpDetails.port;
                defaultValues["password"] = campaignStepDeatils.smtpDetails.password;
            }

            campaignStepDeatils.businessDays && campaignStepDeatils.businessDays.forEach((field) => {
                defaultValues[field.day] = true;
                defaultValues[field.day + '_start'] = new Date(field.businessHours.startTime);
                defaultValues[field.day + '_finish'] = new Date(field.businessHours.endTime);
                defaultValues[field.day + '_break_start'] = new Date(field.breakHours.startTime);
                defaultValues[field.day + '_break_end'] = new Date(field.breakHours.endTime);
            });



            reset(
                defaultValues,
            );

            campaignStepDeatils.holidays && setSelectedDates(campaignStepDeatils?.holidays);
            campaignStepDeatils.staff && setStaffList(campaignStepDeatils.staff);

            if(campaignStepDeatils.formFields){
            const combinedArray = [...InputFieldList, ...campaignStepDeatils.formFields];

            const mergedArray = combinedArray.reduce((accumulator, currentValue) => {
                const existingObject = accumulator.find((obj) => obj.label === currentValue.label);
                if (!existingObject) {
                    accumulator.push(currentValue);
                }
                return accumulator;
            }, []);

            setInputFieldList(mergedArray)
        }}
    }, [])

   
    // Holidays Dates Code Start 
    const handleSelectDate = date => {
        const inputDate = new Date(date);

        const year = inputDate.getFullYear();
        const month = String(inputDate.getMonth() + 1).padStart(2, '0');
        const day = String(inputDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        if (!isNaN(date.getTime())) {
            setSelectedDates(prevDates => {
                if (prevDates.includes(formattedDate)) {
                    return prevDates.filter(d => d !== formattedDate);
                }
                return [...prevDates, formattedDate];
            });
        }
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleDelete = (chipToDelete, i, type) => () => {
        setSelectedDates((chips) => chips.filter((chip) => chip !== chipToDelete));
    };
    // Holidays Dates Code End 

    //   Staff Code Start 
    const addStaff = (val) => {
        setStaffList(val);
    }

    // input field code start 
    const PopupCloseHandler = (val) => {
        setShowInputPopUp(val);
        setAddPaymentPopUp(false)
    }

    const handleAddInputField = (val) => {
        const labelExists = InputFieldList.some((field) => field.label === val.label);

        if (!labelExists) {
            setInputFieldList((prevList) => [...prevList, val]);
            setValue(val.label.split(" ").join(""), true)
        }
        setShowInputPopUp(false)

    }
    
    // Final Submit FUnction 
    const addCampaignDetail = (updatedval) => { 
        // add input fields 
        const iFields = [];
        for (const inputField of InputFieldList) {
            const label = inputField.label;
            if (updatedval.hasOwnProperty(label) && updatedval[label]) {
              (inputField.label == "Name" || inputField.label == "Email") ? null :  iFields.push(inputField);
            }
        }

       
        const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const weekvalue = [];

        week.forEach((fieldName) => {
            if (watch(fieldName)) {
                weekvalue.push({
                    day: fieldName,
                    businessHours: {
                        startTime: updatedval[fieldName + '_start'],
                        endTime: updatedval[fieldName + '_finish'],
                    },
                    breakHours: {
                        startTime: updatedval[fieldName + '_break_start'],
                        endTime: updatedval[fieldName + '_break_end'],
                    },
                });
            }
        });
       
        //extract paymentMethod 
        const paymentOptions = ['paypal', 'stripe', 'cash'];
        const payemtnmethodOption = [];
        let stripe_account, paypal_account;
        let IsValid = true;
        paymentOptions.forEach((fieldName) => {
            if (watch(fieldName)) {
                payemtnmethodOption.push(fieldName);

                if (fieldName == 'paypal') {
                    if(paypalAccList.length == 0){
                        setError(`${fieldName}`, { type: "custom", message: "Add paypal account." });
                        IsValid= false;
                  
                    }else{
                        paypal_account = updatedval.paypal_account;
                    }          
                }
                if (fieldName == 'stripe') {
                    if(stripAccList.length == 0){
                        IsValid= false;
                    setError(`${fieldName}`, { type: "custom", message: "Add stripe account." });
                    }else{
                        stripe_account = updatedval.stripe_account;
                    } 
                  
                }
            }
        })
    

        let saveCampaign = {
            businessDays: weekvalue,
            holidays: selectedDates,
            appointmentTimeSlot: updatedval.appointmentTimeSlot,
            staff: staffList,
            formFields: iFields,
            registrationType: updatedval.type,
            currency: updatedval.currency,
            fee: updatedval.fee, 
        }
        
        if(updatedval.type == 'paid'){
             saveCampaign['paymentMethod'] =payemtnmethodOption;
            saveCampaign['paymentAccountId'] = {
                paypal: paypal_account,
                stripe: stripe_account
            }
          
          }
           
        //   For SMTP Email setting
        saveCampaign['smtp_type'] = updatedval.smtp_type;
        if(updatedval.smtp_type == 'central'){
           if(!hasCentralSmtpAcc){
            setError(`smtp_type`, { type: "custom", message: "Add central smtp email account." });
            IsValid = false;
        }          
        }else{
           
            saveCampaign['smtpDetails'] = {
                'server' : updatedval.server  ,
                'from':updatedval.from  ,'password' : updatedval.password,'port' : updatedval.port
            };
        }
       

       if(IsValid){
                common.saveCampaignData(campaignid,saveCampaign);
                 handleActiveTab(3);
            }

    }
    const handleTab = (val) => {
        handleActiveTab(val)
        handleCampaignIdOnBack(campaignid)
    }
    const isActiveDay = (date) => {
        const dateStr = date.toISOString().split("T")[0]; // Convert date to YYYY-MM-DD format
        return selectedDates.includes(dateStr);
    };

    // Custom disabledDate function to allow only the current year's months
    const disabledDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return  date < today
    };



    const businessDaysContinue = async () => {
        const validationPromises = days.map(day => {
            return Promise.all([
                trigger([day]),
                trigger([`${day}_start`, `${day}_finish`, `${day}_break_start`, `${day}_break_end`, 'appointmentTimeSlot']),
            ]);
        });

        const results = await Promise.all(validationPromises);
        var appointmentTimeSlot = getValues('appointmentTimeSlot')

        const allValid = results.every(([val, isVAlid], index) => {
            if (watch(`${days[index]}`)) {
                let start = getValues(`${days[index]}_start`); 
                let end = getValues(`${days[index]}_finish`);
                let breakstart = getValues(`${days[index]}_break_start`);
                let breakend = getValues(`${days[index]}_break_end`);
                if (start > end) {
                    setError(`${days[index]}_start`, { type: "custom", message: "Start time should be less than finish time." });
                } else if (breakstart > breakend) {
                    setError(`${days[index]}_break_start`, { type: "custom", message: "Start time should be less than finish time." });
                }else if (breakstart < start || breakend > end) {
                    setError(`${days[index]}_break_start`, { type: "custom", message: "Break hours should be within start and finish time." });
                } else{
                    const timeDifferenceMinutes = ((end - start) - (breakend - breakstart) )/ (1000 * 60);
                    if(appointmentTimeSlot < 15){
                        setError(`appointmentTimeSlot`, { type: "custom", message: "The time slot duration should be a minimum of 15 minutes." });
                    }
                    // Compare with appointmentTimeSlot 
                    if (timeDifferenceMinutes < appointmentTimeSlot) {
                        setError(`appointmentTimeSlot`, { type: "custom", message: `The time slot duration cannot exceed the maximum allowed 
                        difference between the start and finish time.` });
                    }
                }
            }
            return val && isVAlid;
        }); 
        const otherKeys = Object.keys(errors).filter(key => !["type", "fee", "currency", "stripe_account", "paypal_account","smtp_type","server","port","password","from"].includes(key));
        
        if (allValid && otherKeys.length == 0) { 
            setExpanded('panel2');
            const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            const weekvalue = [];
            week.forEach((fieldName) => {
                if (watch(fieldName)) {
                    weekvalue.push({
                        day: fieldName,
                        businessHours: {
                            startTime:  getValues(`${fieldName}_start`).toISOString(),
                            endTime:   getValues(`${fieldName}_finish`).toISOString(),
                        },
                        breakHours: {
                            startTime:  getValues(`${fieldName}_break_start`).toISOString(),
                            endTime:  getValues(`${fieldName}_break_end`).toISOString(),
                        },
                    });
                }
            });
            let data ={appointmentTimeSlot:appointmentTimeSlot,businessDays:weekvalue} ;
            common.saveCampaignData(campaignid,data);
        }
    };

    const businessHolidayContinue = ()=>{
        setExpanded('panel3');
        let data ={holidays:selectedDates} ;
        common.saveCampaignData(campaignid,data);
    }

    const businessStaffContinue =() =>{
       setExpanded('panel4');
       let data ={staff:staffList} ;
       common.saveCampaignData(campaignid,data);
    }

    const formFieldContinue = ()=>{
        setExpanded('panel5')
        const iFields = [];
        for (const inputField of InputFieldList) { 
            if (watch(`${inputField.label.split(" ").join("")}`)) {
              (inputField.label == 'Name' || inputField.label == 'Email')? '' :  iFields.push(inputField);
            }
        }
       let data ={formFields:iFields} ;
       common.saveCampaignData(campaignid,data);

    }

    const paymentContinue =() =>{
        let IsValid = true;
        let registrationType = trigger('type')
        registrationType.then((result)=>{  
            if(result){
                let saveCampaign = { registrationType: getValues('type'), }
                if(getValues('type') == 'paid'){
                    const fieldNames = ['currency', 'anotherField', 'fee','paypal' ,'stripe' ,'cash','paypal_account' ,'stripe_account'];
                         
                    const registrationTypes = fieldNames.map(fieldName => trigger(fieldName));
                   
                    Promise.all(registrationTypes)
                            .then(results => { 
                                if (results.every(result => result)) {
                                   if(watch('paypal')){
                                      if(paypalAccList.length == 0){
                                        setError('paypal', { type: "custom", message: "Add paypal account." });
                                        IsValid = false;
                                      }
                                   }
                                   if(watch('stripe')){
                                    if(stripAccList.length == 0){
                                      setError('stripe', { type: "custom", message: "Add stripe account." });
                                      IsValid = false;
                                    }
                                 }
                                 if(IsValid){
                                    const paymentOptions = ['paypal', 'stripe', 'cash'];
                                    const payemtnmethodOption = [];
                                    paymentOptions.forEach((fieldName) => {
                                            if (watch(fieldName)) {
                                                payemtnmethodOption.push(fieldName);
                                        }
                                    })
                                           saveCampaign['currency'] = getValues('currency'),
                                            saveCampaign['fee'] = getValues('fee'), 
                                            saveCampaign['paymentMethod'] = payemtnmethodOption;
                                            saveCampaign['paymentAccountId'] = {
                                                paypal: getValues('paypal_account'),
                                                stripe: getValues('stripe_account'), 
                                            }
                                  common.saveCampaignData(campaignid,saveCampaign);
                                  setExpanded('panel6');
                                  }
         }
                            })
               }else{
                    common.saveCampaignData(campaignid,saveCampaign);
                    setExpanded('panel6');
                }
    }
    })
       }

    const onSubmitCreate = (newdata) => {
        newdata.paymentMethod = paymentMethod,
            callAPI({
                method: 'POST',
                url: `/common/paymentIntegrate`,
                data: newdata
            }, (resp) => {
                if(paymentMethod == 'paypal') paymentList('paypal');
                if(paymentMethod == 'stripe') paymentList('stripe');
                setAddPaymentPopUp(false)
                reset1()
            })
    }

    function CheckExpand(val){
        if(val == 'business'){
            return (errors.appointmentTimeSlot || (errors.Sunday && errors.Monday && errors.Tuesday && errors.Wednesday && errors.Thursday && errors.Friday && errors.Saturday));
        }else if(val == 'payment'){
            return (errors.type || errors.currency || errors.fee || (errors.paypal && errors.stripe && errors.cash));
        }else if(val == 'smtp'){
            return (errors.smtp_type || errors.server || errors.port || errors.from || errors.password )
        }
        return false;
    }
   
    return (

        <>
            <form onSubmit={handleSubmit1(addCampaignDetail)} className='campaign'>
                <div className={(activeTab == 2) ? "show" : "hide"}>
                    <div className={styles.step2_form_wrap}>

                   
                        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{ boxShadow: 0}}> 
                            <AccordionSummary
                                expandIcon={CheckExpand('business') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Business Hours (24 hour format)
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails  sx={{ boxShadow: 0}}>
                                <div>
                                    <div className={styles.bussiness_hour_singe_wrapper}>
                                        <div className={styles.hour_wrap_label}>
                                            <label>Days  <span className='bhub_required'>*</span></label>
                                            <div>Start From  <span className='bhub_required'>*</span></div>
                                            <div>Finish By  <span className='bhub_required'>*</span></div>
                                            <div>Break Start From  <span className='bhub_required'>*</span></div>
                                            <div>Break Finish By  <span className='bhub_required'>*</span></div>
                                        </div>

                                    </div>
                                    {errors.Sunday && errors.Monday && errors.Tuesday && errors.Wednesday && errors.Thursday && errors.Friday && errors.Saturday && <span className='error'>Please select atleast one day.</span>}
                                    {
                                        days.map(day => <div className={styles.bussiness_hour_singe_wrapper} key={day}>
                                            <div className={styles.single_hour_wrap}>
                                                <div className={styles.days_data} onClick={() => setBusinessDay(BusinessDay ? '' : day)}>
                                                    <Form fieldname={`${day}`} label={`${day}`} inputType={'checkbox'} control={control} isRequired={true} fields={days} watch={watch} />
                                                </div>
                                            </div>
                                            {watch(`${day}`) ? (<div className={styles.date_list_wrap}>
                                                <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_start`} inputType='datepicker' placeholder="Start From " control={control} errors={errors} isDisable={false} isRequired={true}  marginVal={'zero'}/>
                                                <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_finish`} inputType='datepicker' placeholder="Finish By" control={control} errors={errors} isDisable={false} isRequired={true} marginVal={'zero'}/>
                                                <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_break_start`} inputType='datepicker' placeholder="Break Start From" control={control} errors={errors} isDisable={false} isRequired={true} marginVal={'zero'}/>
                                                <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_break_end`} inputType='datepicker' placeholder="Break Finish By" control={control} errors={errors} isDisable={false} isRequired={true} marginVal={'zero'}/>
                                            </div>) :
                                                (<div className={styles.date_list_wrap}>
                                                    <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_start`} inputType='datepicker' placeholder="Start From " control={control} errors={errors} isDisable={true} isRequired={false} marginVal={'zero'}/>
                                                    <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_finish`} inputType='datepicker' placeholder="Finish By" control={control} errors={errors} isDisable={true} isRequired={false} marginVal={'zero'}/>
                                                    <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_break_start`} inputType='datepicker' placeholder="Break Start From" control={control} errors={errors} isDisable={true} isRequired={false} marginVal={'zero'}/>
                                                    <Form dateFormate="HH:mm" disbaleDate={true}  fieldname={`${day}_break_end`} inputType='datepicker' placeholder="Break Finish By" control={control} errors={errors} isDisable={true} isRequired={false} marginVal={'zero'}/>
                                                </div>)}
                                        </div>)
                                    }
                                    <div className="space_between mt">
                                        <Form fieldname='appointmentTimeSlot' label={`Time Slot (in min)`} inputType='number' register={register} errors={errors} isRequired={true} />

                                        <button type='button' className="ap_btn" onClick={() => { businessDaysContinue() }}>Continue</button>
                                    </div>

                                </div>
                            </AccordionDetails>
                        </Accordion>
                    
                        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary 
                                expandIcon={svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Business Holidays</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <div className={styles.holidays_wrapper}>
                                        <div className={styles.holiday_calender_wrap}>
                                            <Calendar onSelect={handleSelectDate}
                                                cellClassName={(date) => {
                                                    return isActiveDay(date) ? "active_day" : "";
                                                }}
                                                disabledDate={disabledDate}
                                                format="MM/YYYY"
                                            />

                                        </div>
                                        <div className={styles.holidays_date_wrap}>
                                            {selectedDates.map((date, i) =>
                                                <Chip key={i}
                                                    label={date}
                                                    onDelete={handleDelete(date, i, "holiday")}
                                                    sx={{ margin: "5px" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={()=>businessHolidayContinue()}>Continue</button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                              expandIcon={svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Business Staff</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles.staff_wrapper}>
                                    <StaffCollectionForm addStaff={addStaff} staffList={staffList} />

                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => businessStaffContinue()}>Continue</button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                               expandIcon={svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Form Fields</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div>
                                    <div className={styles.check_box_lists}>
                                        {InputFieldList.map((val, i) => <Form key={i} fieldname={`${val.label.split(" ").join("")}`} label={`${val.label}`} inputType={'checkbox'} control={control} isRequired={false} isDisable={((val.label == 'Email') || (val.label == 'Name'))  ? true : false} />)}
                                        <div className={styles.inpt_add_btn} onClick={() => setShowInputPopUp(true)}><div>+</div> Add Input Fields</div>
                                    </div>

                                    <div className={styles.input_list_fields}>
                                        {

                                            InputFieldList.map((val, i) => watch(`${val.label.split(" ").join("")}`) && <div key={i} className={styles.items}>
                                                {(`${val.inputType}` == "text") && (
                                                    <Form fieldname="default" label={`${val.label}`} inputType='text' register={register} errors={errors} isRequired={false} />
                                                )}
                                                {(`${val.inputType}` == "email") && (
                                                    <Form fieldname='default' label={`${val.label}`} inputType='email' register={register} errors={errors} isRequired={false} />
                                                )}
                                                {(`${val.inputType}` == 'tel') && (
                                                    <Form fieldname={'default'} inputType={"phone"} label={`${val.label}`} register={register} errors={errors} control={control} isRequired={false} />

                                                )}
                                                {(`${val.inputType}` == 'checkbox') && (
                                                    <Form fieldname={'default'} label={`${val.label}`} inputType={'checkbox'} control={control} isRequired={false} />
                                                )}
                                                {(`${val.inputType}` == 'number') && (
                                                    <Form fieldname='default' label={`${val.label}`} inputType='number' register={register} errors={errors} isRequired={false} applyValidation={false} noValidation = {true}/>
                                                )}
                                                {(`${val.inputType}` == 'textarea') && (
                                                    <Form fieldname='default' label={`${val.label}`} inputType='textarea' register={register} errors={errors} isRequired={false} />
                                                )}

                                                {(`${val.inputType}` == 'password') && (
                                                    <Form inputType={'default'} fieldname={'password'} label={`${val.label}`} register={register} errors={errors} isRequired={false} />
                                                )}
                                                {(`${val.inputType}` == 'select') && (
                                                    <Form fieldname="default" label={`${val.label}`} inputType={"select"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />

                                                )}
                                                {(`${val.inputType}` == 'radio') && (
                                                    <Form fieldname={'default'} label={`${val.label}`} inputType={"radio"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />
                                                )}
                                                 {(`${val.inputType}` == 'groupCheckBox') && (
                                                    <Form fieldname={'default'} label={`${val.label}`} inputType={"groupCheckBox"} options={val.options.map(val => { return { label: val, value: val } })} control={control} errors={errors} isRequired={false} />
                                                )}
                                                {(`${val.inputType}` == 'date') && (
                                                    <Form fieldname={'appointment_date_picker'}  disbaleDate={false}  inputType='datepicker' dateFormate="yyyy-MM-dd" placeholder={`${val.label}`} label={`${val.label}`} control={control} errors={errors} isRequired={false} />
                                                )}

                                            </div>)
                                        }

                                    </div>
                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => formFieldContinue('panel5')}>Continue</button>
                                    </div>
                                </div>

                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                                expandIcon={CheckExpand('payment') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Payment</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div className={styles.payment_wrap}>
                               
                                    <Form fieldname={'type'} label={'Registration Type'} inputType={"radio"} options={[{ label: 'Paid', value: 'paid' }, { label: 'Free', value: 'free' }]} control={control} errors={errors} isRequired={true} />
                                    {watch('type') === 'paid' && <>
                                      
                                        <div className={styles.payment_method_wrap}>
                                            <Button className={styles.payment_paypal} onClick={()=>{getValues('paypal') ? setValue('paypal',false) :  setValue('paypal',true)}} ><span className={styles.pay_check_box1}>
                                                <Form fieldname={'paypal'} inputType={'checkbox'} dateclass="#fff" control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                            </span>{svg.paymentt}</Button>
                                            <Button className={styles.payment_stripe} onClick={()=>{getValues('stripe') ? setValue('stripe',false) :  setValue('stripe',true)}}><span className={styles.pay_check_box2}>
                                                <Form fieldname={'stripe'} inputType={'checkbox'} dateclass="#fff" control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                            </span>{svg.stripe}</Button>
                                            <Button className={styles.payment_counter} onClick={()=>{getValues('cash') ? setValue('cash',false) :  setValue('cash',true)}}><span className={styles.pay_check_box3}>
                                                <Form fieldname={'cash'} inputType={'checkbox'} dateclass="#fff" control={control} isRequired={true} fields={['paypal', 'stripe', 'cash']} watch={watch} />
                                            </span>Cash On Counter</Button>
                                        </div>

                                        {(errors.paypal || errors.stripe || errors.cash) && <span className='error'>{errors?.paypal?.message || errors?.stripe?.message || errors?.cash?.message}</span>}
                                        {watch('cash') && <Alert severity="info" className='mt' sx={{border:'1px solid #bee5eb', padding:'2px 16px'}}>If you choose "Cash on Counter" as the payment method, please ensure to check "Phone" field in the form fields.</Alert>}
                                        <div className='input_wrapper_list mt'>
                                            <Form fieldname="currency" label={"Currency"} isDisable={searchParams.get('cid') && campaignStepDeatils?.currency ? true :false} inputType={"select"} options={watch('paypal') ? paypaySupportedCurrency :currencyOptions} control={control} errors={errors} applyValidation={true} isRequired={true} />

                                            <Form fieldname='fee' label='Appointment Fee' applyValidation={true} inputType='number' register={register} errors={errors} isRequired={true} />
                                        </div>
                                        <div className='input_wrapper_list'>
                                            {watch('paypal') && ((paypalAccList.length) ? <><Form fieldname="paypal_account" label={` Paypal Account`} inputType={"select"} options={paypalAccList} control={control} errors={errors} isRequired={true} /></> : <div className={styles.create_acc_mes}>Currently no account added. Please add a paypal account by clicking <a onClick={() =>{setPaymentMethod('paypal');setAddPaymentPopUp(true)}}>here</a> </div>)
                                            }
                                            {watch('stripe') && ((stripAccList.length) ? <><Form fieldname="stripe_account" label={` Stripe Account`} inputType={"select"} options={stripAccList} control={control} errors={errors} isRequired={true} /></> : <div  className={styles.create_acc_mes}>Currently no account added. Please add a stripe account by clicking <a onClick={() => {setPaymentMethod('stripe');setAddPaymentPopUp(true)}}>here</a> </div>)
                                            }
                                        </div>
                                    </>
                                    }
                                    <div className="text-right mt">
                                        <button type='button' className="ap_btn" onClick={() => paymentContinue()}>Continue</button>
                                    </div>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}  sx={{ boxShadow: 0}}>
                            <AccordionSummary
                                expandIcon={CheckExpand('smtp') ?'🔴' : svg.expand_arrow}
                                aria-controls="panel2bh-content"
                                id="panel2bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>Email SMTP</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                        <div>

                        <Form fieldname={'smtp_type'} label={'SMTP Options'} inputType={"radio"} options={[{ label: 'Use central mail settings', value: 'central' }, { label: 'Add SMTP for this campaign', value: 'campaign' }]} control={control} errors={errors} isRequired={true} />
                        {(watch('smtp_type') == "central") && ((!hasCentralSmtpAcc) &&  <div className={styles.create_acc_mes}>Currently SMTP details are not added. Please update  SMTP  details by clicking <Link href={`${process.env.APP_URL}/user/email_setting`}>here</Link> </div>)}

                        {(watch('smtp_type') == 'campaign') && <>
                        <div className='input_wrapper_list'> 
                            <Form fieldname='server' label='Mail Server' inputType='text' register={register} errors={errors} applyValidation={false} isRequired={true} />
                            <Form fieldname='from' label='From' inputType='email' register={register} errors={errors} applyValidation={true} isRequired={true} />
                          </div>
                            <div className='input_wrapper_list'> 
                                <Form inputType={'password'} fieldname={'password'} label={'Password'} register={register} errors={errors} isRequired={true} applyValidation={true} />
                                <Form fieldname='port' label={`Port`} inputType='number' register={register} errors={errors} isRequired={true} applyValidation={false} />
                            </div>
                            </>
                        }
                            </div>
                            </AccordionDetails>
                        </Accordion> 
                       

                        <div className="space_between mt">
                            <button type='button' className="ap_btn_white mx_151" onClick={() => handleTab(1)}>Back</button>
                            <button type="submit" className="ap_btn mx_151" >Next</button>

                        </div>

                    </div>
                </div>
            </form>


            <div className={(activeTab == 3) ? styles.steps_form_wrap + " show" : " hide"}>
                <Step3  campaignid={campaignid} handleActiveTab={handleActiveTab} campaignStepDeatils={campaignStepDeatils} campaignType={'appointment'} />
            </div>
            <Popup show={addPaymentPopUp} onClose={PopupCloseHandler}  heading={`Integrate ${paymentMethod} account`}>
                <form onSubmit={handleSubmit2(onSubmitCreate)}>
                {(paymentMethod == 'paypal') && <>
                    <Form fieldname='accountId' label='Account ID' inputType='email' register={register1} errors={errors1}  isRequired={true} />
                    <Form fieldname='publicKey' label='Client ID' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true}  />
                    <Form fieldname='secretKey' label='Client Secret' inputType='password' register={register1} errors={errors1} isRequired={true} />
                </>}
                {(paymentMethod == 'stripe') && <>
                    <Form fieldname='accountId' label='Account ID' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true}  />
                    <Form fieldname='publicKey' label='Public Key' inputType='text' register={register1} errors={errors1} applyValidation={false} isRequired={true}  />
                    <Form fieldname='secretKey' label='Secret Key' inputType='password' register={register1} errors={errors1} isRequired={true} applyValidation={false} />
                </>}

                <div className="text-center">
                    <button type="submit" className="ap_btn ap_btn_full" >Add</button>
                </div>
                </form>
            </Popup>

            <Popup
                heading={"Add Input Fields"}
                show={showInputPopUp}
                onClose={PopupCloseHandler}
                maxWidth={'570px'}
            >
                <InputFieldsForm handleAddInputField={handleAddInputField} />

            </Popup>
        </>

    )
}

export default Appointment


