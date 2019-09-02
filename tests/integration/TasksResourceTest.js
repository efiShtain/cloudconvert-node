import CloudConvert from '../../lib/CloudConvert.js';
import {assert} from "chai";
import * as fs from 'fs';
import apiKey from './ApiKey';


describe('TasksResouce', () => {


    beforeEach(() => {
        this.cloudConvert = new CloudConvert(apiKey, true);
    });


    describe('upload()', () => {

        it('uploads input.png', async () => {

            let task = await this.cloudConvert.tasks.create('import/upload', {
                'name': 'upload-test'
            });

            const stream = fs.createReadStream(__dirname + '/../integration/files/input.png');

            await this.cloudConvert.tasks.upload(task, stream);

            // wait for task finished
            while(task.status !== 'finished' && task.status !== 'error') {
                await new Promise(done => setTimeout(done, 1000));
                task = await this.cloudConvert.tasks.get(task.id);
            }

            assert.equal(task.status, 'finished');
            assert.equal(task.result.files[0].filename, 'input.png');

        }).timeout(30000);

    });


});