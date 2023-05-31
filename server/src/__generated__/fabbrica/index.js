"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineConfigFactory = exports.defineSleepFactory = exports.defineUserFactory = exports.resetScalarFieldValueGenerator = exports.registerScalarFieldValueGenerator = exports.resetSequence = exports.initialize = void 0;
const internal_1 = require("@quramy/prisma-fabbrica/lib/internal");
var internal_2 = require("@quramy/prisma-fabbrica/lib/internal");
Object.defineProperty(exports, "initialize", { enumerable: true, get: function () { return internal_2.initialize; } });
Object.defineProperty(exports, "resetSequence", { enumerable: true, get: function () { return internal_2.resetSequence; } });
Object.defineProperty(exports, "registerScalarFieldValueGenerator", { enumerable: true, get: function () { return internal_2.registerScalarFieldValueGenerator; } });
Object.defineProperty(exports, "resetScalarFieldValueGenerator", { enumerable: true, get: function () { return internal_2.resetScalarFieldValueGenerator; } });
const modelFieldDefinitions = [{
        name: "User",
        fields: [{
                name: "sleeps",
                type: "Sleep",
                relationName: "SleepToUser"
            }, {
                name: "config",
                type: "Config",
                relationName: "ConfigToUser"
            }]
    }, {
        name: "Sleep",
        fields: [{
                name: "user",
                type: "User",
                relationName: "SleepToUser"
            }]
    }, {
        name: "Config",
        fields: [{
                name: "user",
                type: "User",
                relationName: "ConfigToUser"
            }]
    }];
function isUserconfigFactory(x) {
    return (x === null || x === void 0 ? void 0 : x._factoryFor) === "Config";
}
function autoGenerateUserScalarsOrEnums({ seq }) {
    return {
        id: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "User", fieldName: "id", isId: true, isUnique: false, seq }),
        nickname: (0, internal_1.getScalarFieldValueGenerator)().String({ modelName: "User", fieldName: "nickname", isId: false, isUnique: false, seq })
    };
}
function defineUserFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("User", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateUserScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver !== null && defaultDataResolver !== void 0 ? defaultDataResolver : {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            config: isUserconfigFactory(defaultData.config) ? {
                create: await defaultData.config.build()
            } : defaultData.config
        };
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, requiredScalarData), defaultData), defaultAssociations), inputData);
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().user.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "User",
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
function defineUserFactory(options = {}) {
    return defineUserFactoryInternal(options);
}
exports.defineUserFactory = defineUserFactory;
function isSleepuserFactory(x) {
    return (x === null || x === void 0 ? void 0 : x._factoryFor) === "User";
}
function autoGenerateSleepScalarsOrEnums({ seq }) {
    return {
        start: (0, internal_1.getScalarFieldValueGenerator)().DateTime({ modelName: "Sleep", fieldName: "start", isId: false, isUnique: false, seq }),
        end: (0, internal_1.getScalarFieldValueGenerator)().DateTime({ modelName: "Sleep", fieldName: "end", isId: false, isUnique: false, seq })
    };
}
function defineSleepFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("Sleep", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateSleepScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver !== null && defaultDataResolver !== void 0 ? defaultDataResolver : {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            user: isSleepuserFactory(defaultData.user) ? {
                create: await defaultData.user.build()
            } : defaultData.user
        };
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, requiredScalarData), defaultData), defaultAssociations), inputData);
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().sleep.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Sleep",
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
function defineSleepFactory(options) {
    return defineSleepFactoryInternal(options);
}
exports.defineSleepFactory = defineSleepFactory;
function isConfiguserFactory(x) {
    return (x === null || x === void 0 ? void 0 : x._factoryFor) === "User";
}
function autoGenerateConfigScalarsOrEnums({ seq }) {
    return {};
}
function defineConfigFactoryInternal({ defaultData: defaultDataResolver }) {
    const seqKey = {};
    const getSeq = () => (0, internal_1.getSequenceCounter)(seqKey);
    const screen = (0, internal_1.createScreener)("Config", modelFieldDefinitions);
    const build = async (inputData = {}) => {
        const seq = getSeq();
        const requiredScalarData = autoGenerateConfigScalarsOrEnums({ seq });
        const resolveValue = (0, internal_1.normalizeResolver)(defaultDataResolver !== null && defaultDataResolver !== void 0 ? defaultDataResolver : {});
        const defaultData = await resolveValue({ seq });
        const defaultAssociations = {
            user: isConfiguserFactory(defaultData.user) ? {
                create: await defaultData.user.build()
            } : defaultData.user
        };
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, requiredScalarData), defaultData), defaultAssociations), inputData);
        return data;
    };
    const buildList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => build(data)));
    const pickForConnect = (inputData) => ({
        id: inputData.id
    });
    const create = async (inputData = {}) => {
        const data = await build(inputData).then(screen);
        return await (0, internal_1.getClient)().config.create({ data });
    };
    const createList = (inputData) => Promise.all((0, internal_1.normalizeList)(inputData).map(data => create(data)));
    const createForConnect = (inputData = {}) => create(inputData).then(pickForConnect);
    return {
        _factoryFor: "Config",
        build,
        buildList,
        buildCreateInput: build,
        pickForConnect,
        create,
        createList,
        createForConnect,
    };
}
function defineConfigFactory(options) {
    return defineConfigFactoryInternal(options);
}
exports.defineConfigFactory = defineConfigFactory;
