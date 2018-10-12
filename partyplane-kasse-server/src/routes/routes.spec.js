const chai = require('chai');
chai.use(require('chai-as-promised'));

const expect = chai.expect;
const express = require('express');

describe('routes', () => {
    it('should only export express Router instances', () => {
        const {routes} = require('./index');

        routes.forEach(route => {
            expect(Object.getPrototypeOf(route)).to.equal(express.Router);
        })
    })
});