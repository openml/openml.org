import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import {
    Button,
    FormControl as MuiFormControl,
    Grid,
    Input,
    Paper,
    InputLabel,
    TextField,
    Typography
} from "@material-ui/core";

import {spacing} from "@material-ui/system";
import {Redirect} from "react-router-dom";

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  margin-top:20px;
  margin-bottom:20px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const FormControl = styled(MuiFormControl)(spacing);


function Public() {

    const [error, setError] = useState(false);
    const [errormessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [task, setTask] = useState('');

    const handleChange = (event) => {
        setTask(event.target.value);
    };


    const yourConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    }

    function datatoflask(event) {
        event.preventDefault();

        axios
            .post(process.env.REACT_APP_SERVER_URL + "upload-task", {
                dataset_id: event.target.datasetid.value,
                task_type: event.target.tasktype.value,
                target_name: event.target.targetname.value,
                evaluation_measure: event.target.evaluation_measure.value,
            }, yourConfig)
            .then(function (response) {
                if (response.data.msg === "task uploaded") {
                    setSuccess(true)
                }
                if (response.data.msg === "task exists"){
                    setError(true)
                    setErrorMessage('Task Already Exists')
                }
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.data);
            });

        return false;
    }

    return (
            <form onSubmit={datatoflask}>
                <Typography variant="h1" gutterBottom>
                    Create Task
                </Typography>
                {
                    error &&
                    (
                        <Typography component="h3" variant="body1" align="center" color="red">
                            {errormessage}
                        </Typography>
                    )
                }
                <Grid container spacing={6}>
                    <Grid item md={8}>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="datasetid">dataset id</InputLabel>
                            <Input id="datasetid"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            {/*<InputLabel htmlFor="tasktype">task type</InputLabel>*/}
                            <InputLabel id="tasktype">Task Type</InputLabel>
                            <Select
                                labelId="tasktype"
                                id="tasktype"
                                value={task}
                                onChange={handleChange}
                            >
                                {/*TODO change values and axios request*/}
                                <MenuItem value={'regression'}>RegressionTask</MenuItem>
                                <MenuItem value={'classification'}>ClassificationTask</MenuItem>
                                <MenuItem value={'clustering'}>ClusteringTask</MenuItem>
                                <MenuItem value={'learningcurve'}>LearningCurveTask</MenuItem>
                                <MenuItem value={'supervised'}>SupervisedTask</MenuItem>


                            </Select>
                        </FormControl>

                        <FormControl fullWidth mb={3}>
                            <TextField
                                label="target name"
                                id="targetname"
                                rows={3}
                                rowsMax={4}
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <TextField
                                label="Evaluation Measure"
                                id="evaluation_measure"
                                rows={3}
                                rowsMax={4}
                            />
                        </FormControl>

                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" type="Submit">
                    Upload Task
                </Button>

                {success && (
                    <Redirect to="/"/>
                )}
            </form>
    );
}

function Settings() {
    return (
        <Grid container spacing={3} justifyContent="center">
        <Grid item md={7} xs={10}>
          <Wrapper>
            <Public />
            {/*<Private />*/}
          </Wrapper>
        </Grid>
      </Grid >
    );
}

export default Settings;
