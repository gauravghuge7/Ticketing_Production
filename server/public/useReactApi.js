
import { useState } from "react";
import { extractErrorMessage } from "./htmlError";
import axios from "axios";


/*****
      Author: Gaurav Ghuge
      Date: 7 feb 2025

      All Rights Reserved.
      Licensed under the Apache License, Version 2.0 (the "License");
      you may not use this file except in compliance with the License.

      You may obtain a copy of the License at

      copyright (c) 2025 by Gaurav Ghuge

*/


const useReactApi = () => {
      
      /***
        *  Fields for the managing the API Calls 
      */


      const [data, setData] = useState(null);
      const [error, setError] = useState(null);
      const [htmlError, setHtmlError] = useState(null);
      const [loading, setLoading] = useState(false);
      const [success, setSuccess] = useState(null);
      const [customSuccessMessage, setCustomSuccessMessage] = useState(null);


      /***
        *  Send the Form Data to the API
      */
      const sendFormData = async (URL, formData) => {
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.post(url, formData, config); 

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);

                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }

      const sendJsonData = async (URL, jsonData) => {
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.post(url, jsonData, config); 

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }

      const getDataWithParams = async (URL, params) => {
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.get(url, { params: params, config }); 

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }

      const getData = async (URL) => {
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.get(url, config); 

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }
      }

      const updateJsonDataUsingPut = async (URL, jsonData) => {
            
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.put(url, jsonData, config);

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }

      const updateFormDataUsingPut = async (URL, formData) => {
            
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.put(url, formData, config);

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }

      const updateJsonDataUsingPatch = async (URL, jsonData) => {
            
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.patch(url, jsonData, config);

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }


      const updateFormDataUsingPatch = async (URL, formData) => {
            
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.patch(url, formData, config);

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  // set the HTML Error recieve in html pre format
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }


      const deleteData = async (URL) => {
            try {
                  //// loading and configuration for the API CALLS 
                  setLoading(true);

                  const config = {
                        headers: {
                              'Content-Type': 'application/json',
                        },
                        withCredentials: true,
                  }

                  //// Send the API Call
                  const response = await axios.delete(url, config);     

                  setSuccess(response?.data?.message);
                  setCustomSuccessMessage(response?.data?.message);
                  setData(response?.data);
                  setError(null);
                  return response?.data;
            } 
            catch (error) {

                  // set the Normal Error recieve in json format
                  const errMsg = error?.response?.data;
                  setError(errMsg);

                  
                  const err = error?.response?.data;
                  console.log("error => ", err);
                  const message = extractErrorMessage(err)
                  setHtmlError(message);
                  
            }
            finally {
                  setLoading(false);
            }

            return error;
      }


      /***
        *  Export the Functions for the API Calls
      */


      return {
            data,
            error,
            htmlError,
            loading,
            success,
            customSuccessMessage,
            sendFormData,
            sendJsonData,
            getDataWithParams,
            getData,
            updateJsonDataUsingPut,
            updateFormDataUsingPut,
            updateJsonDataUsingPatch,
            updateFormDataUsingPatch,            
            deleteData
      }
}



export default useReactApi;