/**
 * Created by gevkhanyan on 4/18/18.
 */
exports.validateReqData = (req, type, dataKeys, callback) => {
    let notValidProps = [];
    let dataTypeObj = req[type];
    for (let i = 0; i < dataKeys.length; i++) {
        if (typeof dataTypeObj[dataKeys[i]] === 'undefined' || dataTypeObj[dataKeys[i]] === '') {
            notValidProps.push(dataKeys[i]);
        }
    }
    if (notValidProps.length) {
        callback(true, notValidProps)
    } else {
        callback(false, null);
    }
};