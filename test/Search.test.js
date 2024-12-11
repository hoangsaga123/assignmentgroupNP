import { setupSearchAutocomplete } from '../controllers/search.js'; 
import { suite, test, beforeEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom'; // Simulate DOM environment


suite('Testing setupSearchAutocomplete Module', () => {
    beforeEach(() =>{
        const dom = new JSDOM(`<input id="inputElement" type="text"><div id="resultBox"></div>`);
        const document = dom.window.document;
    })

    test('Testing if search suggestions appear correctly', () => {
        

        
        const inputElementId = 'inputElement';
        const resultBoxId = 'resultBox';
        const availableKeywords = ['mathbook', 'sciencebook', 'historybook'];

        setupSearchAutocomplete(inputElementId, resultBoxId, availableKeywords);

        const inputBox = document.getElementById(inputElementId);
        const resultBox = document.getElementById(resultBoxId);

        // Simulate typing 'ap' in the input box
        inputBox.value = 'math';
        inputBox.dispatchEvent(new dom.window.Event('keyup'));

        // Assert that the resultBox contains the expected suggestion
        assert.strictEqual(
            resultBox.innerHTML.includes('<li onclick="selectInput(\'mathbook\')">mathbook</li>'),
            true,
            'The result box should display "mathbook" as a suggestion'
        );
    });

    test('Testing if no suggestions appear for non-matching input', () => {


        const inputElementId = 'inputElement';
        const resultBoxId = 'resultBox';
        const availableKeywords = ['mathbook', 'sciencebook', 'historybook'];

        setupSearchAutocomplete(inputElementId, resultBoxId, availableKeywords);

        const inputBox = document.getElementById(inputElementId);
        const resultBox = document.getElementById(resultBoxId);

        // Simulate typing 'xyz' in the input box
        inputBox.value = 'xyz';
        inputBox.dispatchEvent(new dom.window.Event('keyup'));

        // Assert that the resultBox is empty
        assert.strictEqual(resultBox.innerHTML,'','The result box should be empty for non-matching input');
    });
});
