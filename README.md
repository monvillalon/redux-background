## About

**redux-background** allows you to create background tasks on redux. This package is very similar to [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-promise](https://www.npmjs.com/package/redux-promise) but adds several features, like statistics, progress and rescheduling.

## Installation

```
npm install redux-background --save
```

or if you use yarn

```
yarn add redux-background
```


## Example

There is an example in this repo under the examples directory.
To run in clone the repo. Go to the *examples* directory
and run `npm install; npm start`

## Setup

When creating the store, you need to add both the reducer, and a middleware provided by the package.

```js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import background from 'redux-background';
	
// Your app reducer
function appReducer(state = {}, action) {
  return state;
}
	
// Add the background reducer
const reducer = combineReducers({
  app: appReducer,
  background: background.reducer,
});
	
// Add the background middleware
// you can add any other middleware you want
const middleware = [
	background.middleware,		
];
	
export default createStore(reducer,applyMiddleware(...middleware)));
```
	
## Basic Usage

Once everything is set up. You can execute a job by dispatching an addJob action creator.

```js
import { startJob } from 'redux-background/actions'; 

...

function generateRandomNumber(job, dispatch, getState) {
	return 4; // Chosen by fair die roll
}

const options = {};
const action = startJob('randomNumber', generateRandomNumber, options);
dispatch(action)

...


```

Once its finished, assuming you mounted your reducer
on *background* your state tree should look something like
this

```js
{
	background: {
		randomNumber: {
		    "times": 1, // The number of times this job has run
		    "active": true, // If the job is active
		    "running": false, // If the job is currently running
		    "startedOn": 1488855527616, // When it started
		    "finishedOn": 1488855526614, // When it finished
		    "lastRanOn": 1488855525107, // The last time it ran
		    "lastDuration": 1507, // How long did it take to run
		    "stoppedOn": 1488855529121, // When was it stopped
		    "value": 10, // The value of the latest run
		    "error": null, // An error if it existed
		    "progress": 100, // The progress of the job
		    "interval":null,
		    "maxTimes": null
		}
	}
}

```

## Repeating Jobs

If you want to make the job automatically repeat after is done
you can use the **addJob** action creator, and pass in some extra options

| Option   | Description                                                                                                  | Default Value |
|----------|--------------------------------------------------------------------------------------------------------------|---------------|
| interval | The frequency to call this job in ms.   After it finishes it will wait interval ms before starting up again. | 1000          |
| maxTimes | How many times will this job be run before it automatically stops                                            | 1  

So for a job that starts again 1s after if finishes you can use this action.

```js
import { addJob } from 'redux-background/actions';

const action = addJob(name, fn, { interval: 1000, maxTimes: Infinity });
```

there is shorthand for this called **addDaemon**

```js
import { addDaemon } from 'redux-background/actions';
const action = addDaemon(name, fn);
```

## Passing Data to The Job

If you pass a data key to the job options, it will be available
inside the first parameter for your job function

```js
import { addJob } from 'redux-background/actions';

function createRandomNumber(job, dispatch, getState) {
  const { max, min } = job.data;
  return Math.round((Math.random() * (max - min)) + min);
}

const action = addJob(name, fn, { 
	interval: 1000, 
	maxTimes: Infinity,
	data: {
		min: 1,
		max: 6,
	}
});
```

## Async Jobs

If your job is async, you have several options to choose from

1. **Use promises** if your job function returns a promise. The value of the job run will the promise value. Following our previous example

	```js
	function generateRandomNumber(job, dispatch, getState) {
		return Promise.resolve(4); // Chosen by fair async die roll
	}
	```

2. **Use callbacks** if your job recieves a fourth argument, it will be a callback you can use to report its error or value. 

	```js
	function generateRandomNumber(job, dispatch, getState, cb) {
		setTimeout(() => cb(null, 4), 0);
	}
	```
	
3. **Use async functions** you can also use async functions

	```js
	async function generateRandomNumber(job, dispatch, getState, cb) {
		const number = await Promise.resolve(4);
		return number;
	}
	```
	
	all jobs will wait until finished to be called again.
	
## Error Handling

An error will be reported and added to the state if

1. Your job throws an error
2. It returns a rejected promise
3. You call the callback with a non null value as its first argument.

The latest error will be available in the state under the error property.

## Reporting Progress

You can report on the progress of a job, 
by calling progress function inside the job parameter.

```js
import Promise from 'bluebird';

async function createRandomNumber(job, dispatch, getState) {
  const { progress } = job;

  await Promise.delay(500);
  progress(25);

  await Promise.delay(500);
  progress(75);

  await Promise.delay(500);
  return 4;
}
```

The current progress will be available in the state under the progress property.

## API

### startJob

Registers a new job and automatically starts it, you can specify
optional **OPTIONS** object with the following options

| Option   | Description                                                                                                  | Default Value |
|----------|--------------------------------------------------------------------------------------------------------------|---------------|
| interval | The frequency to call this job in ms.   After it finishes it will wait interval ms before starting up again. | 1000          |
| maxTimes | How many times will this job be run before it automatically stops                                            | 1  
| data | An object to be passed to the job | {}  

 If the job previously existed it will replace it with this new function. 

```js
import { startJob } from 'redux-background/actions';
const OPTIONS = {
	interval: null,
	maxTimes: 1,
	data: {},
}
startJob(JOBNAME, JOBFN, OPTIONS);
```

### startDaemon

shorthand for **startJob** with the options `interval` **1000** and `maxTimes` **Infinity**

### stopJob

Stops a currently running job

```js
import { stopJob } from 'redux-background/actions';
const action = stopJob(JOBNAME);
```

### removeJob

Deregisters a job, and clears all its data from the state

```js
import { removeJob } from 'redux-background/actions';
const action = removeJob(JOBNAME);
```










