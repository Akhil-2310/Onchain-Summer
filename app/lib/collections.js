import { Mongo } from 'meteor/mongo';

Airdrops = new Mongo.Collection('airdrops');
Claimers = new Mongo.Collection('claimers');
Claims = new Mongo.Collection('claims');