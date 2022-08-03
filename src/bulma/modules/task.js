const cssClass = (taskEnum, { status }) => {
    switch (status) {
        case parseInt(taskEnum.New):
            return 'is-info';
        case parseInt(taskEnum.InProgress):
            return 'is-warning';
        case parseInt(taskEnum.Finished):
            return 'is-success';
        default:
            return '';
    }
};

export default cssClass;
