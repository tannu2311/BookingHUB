import React, { useState } from 'react'
import svg from './svg';
import { Controller } from 'react-hook-form';
import { FormControl, MenuItem, Select, FormControlLabel, RadioGroup, Radio, Checkbox, Tooltip, FormGroup} from '@mui/material';
import { DatePicker } from 'rsuite';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import { DateRangePicker } from 'rsuite';


export const Form = ({ fieldname, label, inputType, register, errors, control, options, isDisable, isRequired, watch, applyValidation, placeholder, fields,dateFormate,dateclass,marginVal,disbaleDate,dateClean,noValidation = false}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConPassword, setShowConPassword] = useState(false);

    const validatePaymentMethods = (fields) => {
        const selectedMethods = fields.filter((method) => watch(method));
        if (selectedMethods.length > 0) {
            return false;
        }
        return true;
    };
    

    const today = new Date();
    today.setHours(0, 0, 0, 0)
    return (
        <>
            {inputType == 'text' && (
                <div className="input_wrapper">
                    <label>{label} {label && isRequired && <span className='bhub_required'>*</span>}</label>
                    <input type='text' className="input" placeholder={`Enter ${label.toLowerCase()}`} disabled={isDisable} {...register(fieldname, {
                        required: isRequired ? `This field is required.` : false,
                        validate: (value) => {
                            if (applyValidation) {
                                if (!/^[A-Za-z\s]+$/.test(value)) {
                                    return  'It should only contain letters.';
                                }
                            }
                        },
                        pattern: {
                            value: /^(?!\s).*$/, message: `It should not contain leading spaces.`
                        }
                    })} />
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>
            )}

            {inputType == 'email' &&
                (<div className="input_wrapper">
                    <label>{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                    <input type='email' className="input" placeholder={`Enter ${label.toLowerCase()}`}   disabled={isDisable} {...register(fieldname, {
                        required: isRequired ? `This field is required.` : false,
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, message: 'Invalid format.'
                        }
                    })} />
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>)
            }

            {inputType == 'number' &&
                (<div className="input_wrapper" style={{maxWidth:(fieldname == 'appointmentTimeSlot')? '318px' : ''}}>
                    <label >{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                    <input type='text' className="input" placeholder={`Enter ${label.toLowerCase()}`} {...register(fieldname, {
                        required: isRequired ? "This field is required." : false,
                        validate: (value) => {
                            if(!noValidation)
                            {
                                if (applyValidation) {
                                    if (!/^(?![\s0]*$)[1-9]\d*(\.\d+)?$/.test(value)) {
                                        return  'It should be greater than 0 and only contain numbers.';
                                    }
                                }else if(!/^(?!0)([1-9]\d*)$/.test(value))
                                {
                                    return  'It should be greater than 0 and only contain numbers.';
                                }
                            }
                        },
                    })}></input>
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>)
            }

            {inputType == 'textarea' &&
                (<div className="input_wrapper" style={{marginBottom : (fieldname == 'reason') && '10px'}}>
                    <label >{label} {label &&  isRequired && <span className='bhub_required'>*</span>}<span className='info'>{(fieldname == 'thankyouMessage') && <Tooltip title="Write thank you message for your user to display after making an appointment." arrow placement="top">{svg.info}</Tooltip>}</span></label>
                    <textarea className="input" rows="4" cols="2" placeholder={`Enter ${label.toLowerCase()}`} {...register(fieldname, {
                        required: isRequired ? "This field is required." : false,
                        validate: (value) => {
                            if (applyValidation) {
                                if (!/^(?!\s).*$/.test(value)) {
                                    return  'It should not contain leading spaces.';
                                }
                            }
                        },
                    })}></textarea>
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>)
            }

            {inputType == 'select' &&
                (
                    <>
                        <div className="select_box" >
                            <label>{label} {label && isRequired && <span className='bhub_required'>*</span>}</label>
                            <div className="mui_select">
                                <Controller
                                    name={fieldname} 
                                    control={control}
                                    rules={{ required: isRequired ? 'Please select at least one option.' : false }}
                                    render={({ field }) => (
                                        <FormControl fullWidth size="small">
                                            <Select
                                                {...field}
                                                displayEmpty={true} disabled={isDisable} 
                                                error={!!errors.Plan}
                                                value={field.value || ''}
                                                sx={{
                                                    color: "white",
                                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#DD1047',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#DD1047',
                                                    },
                                                }}  renderValue={(selected) => { 
                                                    if (selected === undefined || selected === '' ) {
                                                      if(placeholder)
                                                      {
                                                        return <em>{placeholder}</em>
                                                      }
                                                      else{
                                                        return <em>Select {label.toLowerCase()}</em>;
                                                      }
                                                    }else{
                                                        const findItem = options.find(obj => obj.value === selected)
                                                        return findItem ? findItem.label : null
                                                    }
                                                }
                                                }>
                                                
                                                {options.length ?
                                                options.map(option => (
                                                    <MenuItem key={option.label} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                )) :
                                                <MenuItem key={`No ${label} available`} value={''}>
                                                     No {label} Available.
                                                    </MenuItem>     
                                                }
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                            </div></div>
                    </>
                )
            }

            {inputType == 'radio' && (
                <>
                    <div className="input_wrapper">
                        <label>{label} {label && isRequired && <span className='bhub_required'>*</span>}</label>
                        <FormControl>
                            <Controller
                                name={fieldname}
                                control={control}
                                rules={{ required: isRequired ? 'This field is required.' : false }}
                                render={({ field }) => (
                                    <RadioGroup {...field} row sx={{flexDirection:(fieldname == 'filter_pay_method') && 'column'}}>
                                        {options.map(option => (
                                            <FormControlLabel
                                                key={option.label}
                                                sx={{color:option.color ? option.color : ''}}
                                                value={option.value}
                                                control={<Radio size='small' 
                                                sx={{
                                                    color: option.color ? option.color : '#DD1047',
                                                    '&.Mui-checked': {
                                                        color: option.color ?option.color : '#DD1047',
                                                    },
                                                    
                                                }} />}
                                                label={option.label}
                                            />
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}

                    </div>
                </>
            )}

            {inputType == 'checkbox' && ( 
                <Controller
                    name={fieldname}
                    control={control}
                    defaultValue={isDisable? true : false}
                    rules={{ required: isRequired ? validatePaymentMethods(fields) ? 'Please select atleast one option.' : false : false }}
                    render={({ field }) => (
                        <FormControlLabel
                        control={ 
                            <Checkbox
                                {...field} size="small"
                                // aria-label={label}
                                checked={field.value}
                                disabled = {isDisable? true : false}
                                inputProps={{ tabIndex: -1 }}
                                sx={{
                                    color: (fieldname == "paypal" ||fieldname == "stripe" ||fieldname == "cash") ? "#fff" : "#DD1047",
                                    '&.Mui-checked': {
                                        color: (fieldname == "paypal"||fieldname == "stripe" ||fieldname == "cash") ? "#fff" : "#DD1047",
                                    },
                                }}
                            />}
                            label={label}
                             />
                    )}
                />
            )}

            {inputType == 'password' && (
                <div className="input_wrapper">
                    <label>{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                    <input
                        type={(showPassword || showConPassword) ? 'text' : 'password'}
                        className="input"
                        placeholder={`Enter ${label.toLowerCase()}`}
                        {...register(fieldname, {
                            required: isRequired ? `This field is required.` : false,
                            validate: (val) => {
                                if (fieldname === 'confirm_password' && watch('password') !== val) {
                                    return 'Your passwords do not match.';
                                }
                            },
                            pattern: 
                                applyValidation
                                ? { value: /^(?!\s).*$/, message: 'It should not contain leading spaces.' }
                                : false,
                        })}
                    />
                    <span className={"auth_icon"} onClick={() => {
                        if (fieldname === 'password') {
                            setShowPassword(!showPassword);
                        }
                        else {
                            setShowConPassword(!showConPassword);
                        }
                    }}>
                        {(showPassword || showConPassword) ? svg.open_eye : svg.close_eye}
                    </span>

                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>
            )}

            {
                inputType == 'datepicker' && (
                    <div className="select_box" style={{marginBottom:(marginVal == 'zero') && '0px'}}>
                        <label>{label} {(isRequired && label) && <span className='bhub_required'>*</span>}</label>
                        <div className="mui_select">

                            <Controller
                                name={fieldname}
                                control={control}
                                rules={{ required: isRequired ? 'Please select at least one option.'  : false}}
                                render={({ field }) => (
                                    <DatePicker 
                                     {...field}  
                                     disabled={isDisable} 
                                     format={dateFormate} ranges={[]} 
                                   
                                     className={dateclass ? dateclass : dateFormate ==  "HH:mm" ? "time_picker" : "datepicker" } 
                                     placeholder={placeholder}
                                     placement="bottomStart" appearance="default"
                                     disabledDate={date =>(disbaleDate) ? date < today : ''}
                                    
                                    />
                                )}
                            />
                            {errors[fieldname] && <span className='error' style={{width: (dateFormate ==  "HH:mm") && '160px'}}>{errors[fieldname].message}</span>}
                        </div></div>
                )
            }

            {
                inputType == 'daterangepicker' && (
                    <div className="select_box">
                        <label>{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                        <div className="mui_select">
                           
                            <Controller
                                name={fieldname}
                                control={control}
                                rules={{ required: isRequired ? 'Please select at least one date.'  : false}}
                                render={({ field }) => (
                                    <DateRangePicker  className='app_date_Range_picker' 
                                    {...field} 
                                    disabled={isDisable}
                                    format={'dd-MM-yyyy'}
                                     placement="bottomEnd"
                                     disabledDate={date => (disbaleDate) ? date < today : ''}
                                     onClean={(event) =>dateClean()}
                                      />
                                )}
                            />
                            {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                        </div></div>
                )
              
            }

            {inputType == 'phone' && (
                <div className="input_wrapper input">
                    <label>{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                    <Controller
                        name={fieldname}
                        control={control}
                        rules={{
                            required: isRequired ? `This field is required.` : false,
                        }}
                        render={({ field }) => (
                            <PhoneInput
                                {...field}
                                international
                                defaultCountry="IN"
                                limitMaxLength={12}
                            />
                        )}
                    />
                    {errors[fieldname] && <span className='error'>{errors[fieldname].message}</span>}
                </div>
            )}

            {
                inputType == 'groupCheckBox' && (  <div className="input_wrapper">
                <label>{label} {isRequired && <span className='bhub_required'>*</span>}</label>
                <Controller
                    name="checkboxGroup"
                    control={control}
                    rules={{ required: isRequired ? 'This field is required.' : false }}
                    render={({ field }) => (
                      <FormGroup  {...field} row>
                              {options.map(option => (
                                          <FormControlLabel
                                                key={option.label}
                                                value={option.value}
                                                control={<Checkbox size='small' 
                                                sx={{
                                                    color: '#DD1047',
                                                    '&.Mui-checked': {
                                                        color: '#DD1047',
                                                    },
                                                }} />}
                                                label={option.label}
                                            />
                                        ))}
                        </FormGroup>
                    )}
                  />
                  </div>
                  )
            }
        </>
    )
}




