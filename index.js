const Alexa = require('ask-sdk-core');
const axios = require('axios')
const skillBuilder = Alexa.SkillBuilders.custom();



//"AMAZON.FallbackIntent"
//"AMAZON.CancelIntent"
//"AMAZON.HelpIntent"
//"AMAZON.StopIntent
//"AMAZON.NavigateHomeIntent"

async function getQuote() {
    const response = await axios.get(`https://ron-swanson-quotes.herokuapp.com/v2/quotes`)
    return response.data
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('You have reached the Parks Department! Would you like a Swansonism?')
            .reprompt('Would you like a quote from Ron Swanson?')
            .withShouldEndSession(false)
            .getResponse()
    },
}

const NoIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent'
    },
    handle(handlerInput) {
        const speechText = 'I think that all government is a waste of taxpayer money.  Thanks for visiting the Parks Department.'

        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse()
    },
}

const YesIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
    },
    async handle(handlerInput) {
        const quote = await getQuote()
        const reprompt = 'Would you like another quote?'
        return handlerInput.responseBuilder
            .speak(`<break strength='strong' />${quote}<break strength='strong' /> ${reprompt}`)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse()
    },
}


const QuoteIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuoteIntent'
    },
    async handle(handlerInput) {
        const quote = await getQuote()
        const reprompt = 'Would you like another quote?'
        return handlerInput.responseBuilder
            .speak(`<break strength='strong' />${quote}<break strength='strong' /> ${reprompt}`)
            .reprompt(reprompt)
            .withShouldEndSession(false)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Ron Swanson Quotes is your source for all things Swanson. You can say 'Quote Ron' to hear his wisdom.")
            .reprompt("Ron Swanson Quotes is your source for all things Swanson. You can say 'Quote Ron' to hear his wisdom.")
            .withShouldEndSession(false)
            .getResponse()
    },
}

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent'
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I'm sorry, I'm not sure what that is. Do you want a Ron Swanson Quote?")
            .reprompt("Would you like a quote from Ron Swanson?")
            .withShouldEndSession(false)
            .getResponse()
    }
}

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak('Goodbye!')
            .withShouldEndSession(true)
            .getResponse()
    },
}

const ErrorHandler = {
    canHandle() {
        return true
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("I'm sorry I didn't catch that. Can you repeat that?")
            .reprompt("I'm sorry I didn't catch that. Can you repeat that?")
            .withShouldEndSession(false)
            .getResponse()
    },
}

const builder = Alexa.SkillBuilders.custom()

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        QuoteIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        YesIntentHandler,
        NoIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
