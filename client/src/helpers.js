import _ from 'lodash';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export const setUserAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export const timeFromXmlTimeString = (timeString) => {
    if (!timeString && timeString === "") return null;

    const pattern = /[-T:+]/g;
    const date = new Date(0, 0, 0);
    if (pattern.test(timeString)) {
        const bits = timeString.split(/[-T:+]/g);
        date.setHours(bits[0], bits[1], bits[2]);
    } else {
        const [hours, minutes, seconds] = timeString.split(':');
        date.setHours(hours, minutes, seconds);
    }

    // Apply offset and local timezone
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

    // d is now a local time equivalent to the supplied time
    return date.toLocaleTimeString();
}

export const dateFromXmlDateString = (dateString) => {
    if (!dateString && dateString === "") return null;
    let date;

    const pattern = /[-T:+]/g;
    if (pattern.test(dateString)) {
        const bits = dateString.split(/[-T:+]/g);
        date = new Date(bits[0], bits[1] - 1, bits[2]);
    } else {
        const [day, month, year] = dateString.split('/');
        date = new Date(year, month - 1, day);
    }

    return date.toISOString().substring(0, 10);
}

export const dateTimeFromXmlDateTimeString = (dateTimeString) => {
    if ((!dateTimeString && dateTimeString === "") || dateTimeString === 'Invalid Date') return null;
    let dateTime;

    const pattern = /[-T:+]/g;
    if (pattern.test(dateTimeString)) {
        const bits = dateTimeString.split(/[-T:+]/g);
        dateTime = new Date(bits[0], bits[1] - 1, bits[2]);
        dateTime.setHours(bits[3], bits[4], bits[5].replace("Z", ""));

        //Apply offset and local timezone
        dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset());
    } else {
        const [datePart, timePart] = dateTimeString.split(', ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');

        const dateTime = new Date(`${year}-${month}-${day}`);
        dateTime.setHours(hours, minutes, seconds);
        dateTime.setMinutes(dateTime.getMinutes() - dateTime.getTimezoneOffset());
    }

    return dateTime.toISOString();

}


// Check if all required fields are valid
export const isFormValid = (fields, fieldValidity) => {

    return fields.filter(field => !field.partOfPrimaryKey && (field.type === 'Date' || field.type === 'DateTime' || field.type === 'Time'))
        .every(field => {
            if (field.type === 'Date' || field.type === 'DateTime' || field.type === 'Time') {
                // For 'Date', 'DateTime', or 'Time' fields, consider them required
                return !!fieldValidity[field.name];
            } else {
                // For other field types, consider them always valid - i.e can be empty
                return true;
            }
        });
}

export const mapPrimaryKeyFieldstoRecord = (fields, record) => {
    return fields
        .filter((field) => field.partOfPrimaryKey)
        .map((field) => ({
            id: String(field.id),
            value: record[field.id - 1],
            type: field.type,
        }));
};

export const mapFieldstoRecord = (fields, record) => {
    return fields.map((field, idx) => {
        let value;

        switch (field.type) {
            case 'Boolean':
                value = record[idx] ? record[idx] : false;
                break;
            case 'Decimal':
            case 'Integer':
                value = record[idx] ? record[idx] : 0;
                break;
            default:
                value = record[idx] ? record[idx] : '';
        }

        return {
            id: String(field.id),
            value: value,
            type: field.type,
        };
    });
};


export const getUpdatedRecordAndFields = (currentRecord, initialRecord, fields) => {
    const changedValues = _.differenceWith(currentRecord, initialRecord, _.isEqual);
    const changedIndices = [];
    let changedObjects = [];

    // Find the indices of changed values in currentRecord
    currentRecord.forEach((value, index) => {
        if (_.some(changedValues, (changedValue) => _.isEqual(value, changedValue))) {
            changedIndices.push(index);
        }
    });

    // Create a record object {id, value} with changed values and indices
    changedIndices.forEach((changeIndex, index) => {
        changedObjects.push({
            id: String(fields[changeIndex].id),
            value: changedValues[index],
            type: fields[changeIndex].type
        });
    });

    // Add primaryKey fields to the record object
    changedObjects = _.concat(mapPrimaryKeyFieldstoRecord(fields, initialRecord), changedObjects);

    const idFilterString = changedObjects.map(item => item.id).join('|');

    return { idFilterString, changedObjects };
}

export const caesarEncrypt = (input, shift) => {
    let encryptedText = '';
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        charCode += shift;
        if (charCode < 32) {
            charCode = 32;
        } else if (charCode > 122) {
            charCode = 122;
        }
        encryptedText += String.fromCharCode(charCode);
    }
    return encryptedText;
};

export const caesarDecrypt = (input, shift) => {
    let decryptedText = '';
    for (let i = 0; i < input.length; i++) {
        let charCode = input.charCodeAt(i);
        charCode -= shift;
        if (charCode < 32) {
            charCode = 32;
        } else if (charCode > 122) {
            charCode = 122;
        }
        decryptedText += String.fromCharCode(charCode);
    }
    return decryptedText;
};

export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};
