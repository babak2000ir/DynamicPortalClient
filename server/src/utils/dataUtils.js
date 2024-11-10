import { dataHeap } from '../services/businessCentralService.js';

export const dataLayer = (data, func, body) => {
    let fields = [];

    switch (func) {
        case 'TableData':
            fields = dataHeap.tables.tables.find(table => table.id == body.pTableNo).fields;
            data.fields = fields;
            data = fixDateTimes(data);
            return data;
        case 'EntityData':
            fields = dataHeap.entities.entities.find(entity => entity.entityCode === body.pEntityCode).fields;
            data.fields = fields;
            data = fixDateTimes(data);
            return data;
        default:
            return data;
    }
}

export const fixDateTimes = (data) => {
    const records = data.data.records;
    const fields = data.fields;
    const dateFields = fields.filter((field, indexPos) => field.type === 'Date' && (field.indexPos = indexPos));
    const timeFields = fields.filter((field, indexPos) => field.type === 'Time' && (field.indexPos = indexPos));
    const dateTimeFields = fields.filter((field, indexPos) => field.type === 'DateTime' && (field.indexPos = indexPos));
    const dateTimes = dateFields.concat(timeFields).concat(dateTimeFields);

    dateTimes.forEach((field) => {
        records.forEach((record) => {
            if (record[field.indexPos] !== null && record[field.indexPos] !== "") {
                if (field.type === 'Time') {
                    const [hours, minutes, seconds] = record[field.indexPos].split(':');
                    const date = new Date(0, 0, 0);
                    date.setHours(hours, minutes, seconds);
                    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
                    record[field.indexPos] = date.toLocaleTimeString();
                } else {
                    const date = new Date(record[field.indexPos]);
                    record[field.indexPos] = field.type === 'Date' ? date.toISOString().substring(0, 10) : date.toISOString();
                }
            }
        });
    });

    return data;
}

export const dataLayerMetadata = (data) => {
    const records = data.data.records;
    const metadata = Array(records.length).fill().map(() => []);
    //browse fields based on datatype and add metadata to records
    data.fields.forEach((field, fieldIdx) => {
        switch (field.type) {
            case 'Integer':
            case 'Decimal':
            case 'Text':
            case 'Code':
            case 'Option':
            case 'Boolean':
            case 'GUID':
                records.forEach((record, recordIdx) => {
                    metadata[recordIdx].push(null);
                });
                return;
            case 'Time':
                records.forEach((record, recordIdx) => {
                    metadata[recordIdx].push(record[fieldIdx]);
                });
                return;
            case 'Date':
                records.forEach((record, recordIdx) => {
                    metadata[recordIdx].push(record[fieldIdx]);
                });
                return;
            case 'DateTime':
                records.forEach((record, recordIdx) => {
                    metadata[recordIdx].push(record[fieldIdx]);
                });
                return;
            case 'RecordID':
                records.forEach((record, recordIdx) => {
                    metadata[recordIdx].push(record[fieldIdx]);
                });
                return;
            default:
                return;
        }
    });

    return metadata;
}
