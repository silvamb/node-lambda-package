const tarToZip = require('tar-to-zip');
const fs = require('fs');
 
const packageConfigRaw = fs.readFileSync('package.json');
const packageConfig = JSON.parse(packageConfigRaw); 
const tarFileName = packageConfig.name+'-'+packageConfig.version + '.tgz';
const zipFileName = packageConfig.name+'-'+packageConfig.version + '.zip';


console.log(packageConfig.name);

const onError = ({message}) => {
    console.error(message);
};
 
const zip = fs.createWriteStream(zipFileName);
const progress = true;

// exclude only package.json
const filter = ({name}) => {
    return name.startsWith('package/src') || name.startsWith('package/node_modules');
};

// move files from folder 'package' to root folder
const map = ({name}) => {
    var replacementRegex = /^package\//;

    // move all files from 'src' folder to the root folder
    if(name.startsWith('package/src')) {
        replacementRegex = /^package\/src\//;
    }

    return {
        name: name.replace(replacementRegex, '')
    };
};

tarToZip(tarFileName, {filter, map})
    .on('error', onError)
    .getStream()
    .pipe(zip);
