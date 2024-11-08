"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/utils/test-db-connection.ts
var supabase_js_1 = require("@supabase/supabase-js");
var supabaseUrl = 'https://hrxfvxovojsfowuiinik.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyeGZ2eG92b2pzZm93dWlpbmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NzkyNzAsImV4cCI6MjA0NjM1NTI3MH0.DC1ShVYEg5h1TNggufRaa7i9uwOpzBJ8Ibf1p02qxT0';
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function testConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, connectionTest, connectionError, _b, authTest, authError, tables, _i, tables_1, table, error, error_1, profilesError, preferencesError, historyError, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 12, 13, 14]);
                    // Test 1: Basic Connection
                    console.log('Testing Supabase Connection...');
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .select('*')
                            .limit(1)];
                case 1:
                    _a = _c.sent(), connectionTest = _a.data, connectionError = _a.error;
                    if (connectionError) {
                        throw new Error("Connection Error: ".concat(connectionError.message));
                    }
                    console.log('✅ Database connection successful');
                    // Test 2: Auth Service
                    console.log('\nTesting Auth Service...');
                    return [4 /*yield*/, supabase.auth.getSession()];
                case 2:
                    _b = _c.sent(), authTest = _b.data, authError = _b.error;
                    if (authError) {
                        throw new Error("Auth Error: ".concat(authError.message));
                    }
                    console.log('✅ Auth service is working');
                    // Test 3: Check Tables
                    console.log('\nChecking Database Tables...');
                    tables = [
                        'profiles',
                        'user_preferences',
                        'watchlists',
                        'watch_history',
                        'movie_streams',
                        'movie_subtitles',
                        'player_analytics'
                    ];
                    _i = 0, tables_1 = tables;
                    _c.label = 3;
                case 3:
                    if (!(_i < tables_1.length)) return [3 /*break*/, 8];
                    table = tables_1[_i];
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, supabase
                            .from(table)
                            .select('*')
                            .limit(1)];
                case 5:
                    error = (_c.sent()).error;
                    if (error) {
                        console.log("\u274C Table '".concat(table, "' check failed: ").concat(error.message));
                    }
                    else {
                        console.log("\u2705 Table '".concat(table, "' is accessible"));
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _c.sent();
                    console.log("\u274C Table '".concat(table, "' check failed: ").concat(error_1 instanceof Error ? error_1.message : 'Unknown error'));
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8:
                    // Test 4: Specific Table Tests
                    console.log('\nTesting Specific Tables...');
                    return [4 /*yield*/, supabase
                            .from('profiles')
                            .select('id, username, created_at')
                            .limit(1)];
                case 9:
                    profilesError = (_c.sent()).error;
                    console.log(profilesError
                        ? "\u274C Profiles table error: ".concat(profilesError.message)
                        : '✅ Profiles table working');
                    return [4 /*yield*/, supabase
                            .from('user_preferences')
                            .select('user_id, favorite_genres')
                            .limit(1)];
                case 10:
                    preferencesError = (_c.sent()).error;
                    console.log(preferencesError
                        ? "\u274C User preferences table error: ".concat(preferencesError.message)
                        : '✅ User preferences table working');
                    return [4 /*yield*/, supabase
                            .from('watch_history')
                            .select('user_id, movie_id')
                            .limit(1)];
                case 11:
                    historyError = (_c.sent()).error;
                    console.log(historyError
                        ? "\u274C Watch history table error: ".concat(historyError.message)
                        : '✅ Watch history table working');
                    return [3 /*break*/, 14];
                case 12:
                    error_2 = _c.sent();
                    console.error('❌ Test failed:', error_2 instanceof Error ? error_2.message : 'Unknown error');
                    return [3 /*break*/, 14];
                case 13:
                    console.log('\nTest completed');
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    });
}
// Run the test
console.log('Starting Database Connection Tests...\n');
testConnection();
