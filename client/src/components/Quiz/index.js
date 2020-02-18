import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; 
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';



function App() {
  const [selectedDate, handleDateChange] = useState(new Date());
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker value={selectedDate} onChange={handleDateChange} label="Departure Date" margin="normal" />
      <DatePicker value={selectedDate} onChange={handleDateChange} label="Return Date" margin="normal" />
    </MuiPickersUtilsProvider>
    
  );
}
export default App;
 