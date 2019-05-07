export const tabNames = {
    alarms: 'alarms',
    observations: 'observations',
    mainEvents: 'mainEvents',
    allEvents: 'allEvents',
};

export const eventStatusNames = {
    processing: 'PROCESSING',
    new: 'NEW',
    closed: 'CLOSED',
};

export const statusNames = {
    militant: 'MILITANT',
    testing: 'TESTING',
    observing: 'OBSERVING',
};

export const statusColors = {
    MILITANT: 'militant',
    TESTING: 'testing',
    OBSERVING: 'observing',
};

export const sortEventsFields = {
    text: 'text',
    panelNumber: 'panelNumber',
    zoneNumber: 'zoneNumber',
    panelTime: 'controlDeviceTime',
    serverRegTime: 'serverRegTime',
    status: 'eventStatus',
    objectName: 'observationName',
    operator: 'connection.observation.observationGroup.operator',
};

export const sortObservationsFields = {
    observeUntil: 'controlDevice.observeUntil',
    panelNumber: 'panelNumber',
    name: 'observation.name',
    techPco: 'observation.observationGroup.techPco',
    operator: 'observation.observationGroup.operator',
    user: 'observation.responseSvc.responsibleUser',
};

export const toastTypes = {
    getToWork: 'getToWork',
    timer: 'timer',
};

export const supervisionStatusEnums = {
    active: 'ACTIVE',
    closed: 'CLOSED',
};