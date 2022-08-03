const cssClass = (statuses, { status }) => {
    switch (status) {
        case parseInt(statuses.Finished):
            return 'is-success';
        case parseInt(statuses.Progress):
            return 'is-warning';
        case parseInt(statuses.New):
            return 'is-info';
        default:
            return '';
    }
};

export default cssClass;
