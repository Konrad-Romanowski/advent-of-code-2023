const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'input.txt');

function getNextWorkflow(item,condition) {
    const {parameter, operator, value, nextWorkflow} = condition;
    if(operator === '<') {
        if(parseInt(item[parameter]) < value) return nextWorkflow
    } else if(operator === '>') {
        if(parseInt(item[parameter]) > value) return nextWorkflow
    }
    return null;
};

fs.readFile(inputPath,'utf-8',(err,inputFileData) => {
    if(err) {
        console.log(`Cannot open the file: ${inputPath}`);
    } else {
        const data = inputFileData.split('\r\n');

        const items = [];
        const workflows = {};

        data.forEach(line => {
            if(line[0] === '{') {
                let item = line.replace(/=/g,'":"')
                               .replace(/,/g,'","')
                               .replace('{','{"')
                               .replace('}','"}');
                items.push(JSON.parse(item));
            } else {
                if(line.length !== 0) {
                    const workflowName = line.match(/[a-z]+/)[0];
                    const idx = line.indexOf('{');

                    let workflowSort = line.slice(idx).replace(/\{?\}?/g,'').split(',');

                    let conditions = workflowSort.slice(0,-1);
                    const nextWorkflow = workflowSort[workflowSort.length-1];

                    conditions = conditions.map(condition => {
                        const parameter = condition[0];
                        const operator = condition[1];
                        const valueAndNextWorkflow = condition.slice(2).split(':');
                        const value = parseInt(valueAndNextWorkflow[0]);
                        const nextWorkflow = valueAndNextWorkflow[1];

                        return {parameter, operator, value, nextWorkflow};
                    });

                    workflows[workflowName] = {conditions, nextWorkflow};
                }
            }
        });

        let accepted = [];

        items.forEach(item => {
            let currentWorkflowName = 'in';
            while(currentWorkflowName !== 'A' && currentWorkflowName !== 'R') {
                let nextWorkflowName = workflows[currentWorkflowName].nextWorkflow;
                let workflowFromCondition;
    
                for(let i = 0; i < workflows[currentWorkflowName].conditions.length; i++) {
                    workflowFromCondition = getNextWorkflow(item,workflows[currentWorkflowName].conditions[i]);
                    if(workflowFromCondition) break;
                }
        
                if(workflowFromCondition) {
                    currentWorkflowName = workflowFromCondition;
                } else {
                    currentWorkflowName = nextWorkflowName;
                }

                if(currentWorkflowName === 'A') accepted.push(item);
            }
        });

        const result = accepted.reduce((total,item) => {
            return total += parseInt(item.x) + parseInt(item.m) + parseInt(item.a) + parseInt(item.s);
        },0);

        console.log(result);
    }
});