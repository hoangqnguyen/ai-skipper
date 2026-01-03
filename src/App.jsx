import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Switch } from "./components/ui/switch"
import { Badge } from "./components/ui/badge"
import { Settings, Play, Radio, Plus, X, List } from "lucide-react"
import { DEFAULT_KEYWORDS, DEFAULT_CHANNELS, DEFAULT_REGEX, DEFAULT_CHECK_INTERVAL } from "./defaults"

export default function App() {
    const [activeTab, setActiveTab] = useState("general")
    const [enabled, setEnabled] = useState(true)
    const [keywords, setKeywords] = useState([])
    const [channels, setChannels] = useState([])
    const [regexPatterns, setRegexPatterns] = useState([])
    const [checkInterval, setCheckInterval] = useState(DEFAULT_CHECK_INTERVAL)
    const [newKeyword, setNewKeyword] = useState("")
    const [newChannel, setNewChannel] = useState("")
    const [newRegex, setNewRegex] = useState("")

    // Load Settings
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['enabled', 'keywords', 'channels', 'regexPatterns', 'checkInterval'], (result) => {
                setEnabled(result.enabled !== false);
                setKeywords(result.keywords || DEFAULT_KEYWORDS);
                setChannels(result.channels || []);

                // If regexPatterns is undefined, use defaults. If empty array (user cleared it), keep empty.
                // But for first run, it will be undefined.
                if (result.regexPatterns !== undefined) {
                    setRegexPatterns(result.regexPatterns);
                } else {
                    setRegexPatterns(DEFAULT_REGEX);
                }

                setCheckInterval(result.checkInterval || DEFAULT_CHECK_INTERVAL);
            });
        } else {
            // Dev mode fallback
            setKeywords(DEFAULT_KEYWORDS);
            setRegexPatterns(DEFAULT_REGEX);
            setCheckInterval(DEFAULT_CHECK_INTERVAL);
        }
    }, []);

    // Save Settings Helpers
    const saveEnabled = (val) => {
        setEnabled(val);
        if (chrome.storage) chrome.storage.local.set({ enabled: val });
    }

    const saveKeywords = (newKeys) => {
        setKeywords(newKeys);
        if (chrome.storage) chrome.storage.local.set({ keywords: newKeys });
    }

    const saveChannels = (newChans) => {
        setChannels(newChans);
        if (chrome.storage) chrome.storage.local.set({ channels: newChans });
    }

    const saveRegexPatterns = (newPatterns) => {
        setRegexPatterns(newPatterns);
        if (chrome.storage) chrome.storage.local.set({ regexPatterns: newPatterns });
    }

    const saveCheckInterval = (val) => {
        const newVal = parseInt(val);
        setCheckInterval(newVal);
        if (chrome.storage) chrome.storage.local.set({ checkInterval: newVal });
    }

    // Handlers
    const addKeyword = () => {
        if (newKeyword && !keywords.includes(newKeyword.toLowerCase())) {
            saveKeywords([...keywords, newKeyword.toLowerCase()]);
            setNewKeyword("");
        }
    }

    const removeKeyword = (k) => {
        saveKeywords(keywords.filter(item => item !== k));
    }

    const addChannel = () => {
        if (newChannel && !channels.includes(newChannel)) {
            saveChannels([...channels, newChannel]);
            setNewChannel("");
        }
    }

    const removeChannel = (c) => {
        saveChannels(channels.filter(item => item !== c));
    }

    const addRegex = () => {
        if (newRegex) {
            // Basic validation
            try {
                new RegExp(newRegex);
                if (!regexPatterns.includes(newRegex)) {
                    saveRegexPatterns([...regexPatterns, newRegex]);
                    setNewRegex("");
                }
            } catch (e) {
                alert("Invalid Regular Expression");
            }
        }
    }

    const removeRegex = (r) => {
        saveRegexPatterns(regexPatterns.filter(item => item !== r));
    }

    return (
        <div className="w-[350px] p-4 bg-background min-h-[500px] text-foreground">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <img src="icons/icon48.png" className="w-8 h-8 rounded-sm" alt="Logo" /> AI Skipper
                </h1>
                <Switch checked={enabled} onCheckedChange={saveEnabled} />
            </div>

            <div className="flex mb-4 border-b">
                <button
                    onClick={() => setActiveTab("general")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors text-center ${activeTab === "general" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab("keywords")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors text-center ${activeTab === "keywords" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Keywords
                </button>
                <button
                    onClick={() => setActiveTab("channels")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors text-center ${activeTab === "channels" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Channels
                </button>
                <button
                    onClick={() => setActiveTab("regex")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors text-center ${activeTab === "regex" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                    Regex
                </button>
            </div>

            {activeTab === "general" && (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Status</CardTitle>
                            <CardDescription>
                                extension is currently <span className={enabled ? "text-green-500 font-bold" : "text-red-500 font-bold"}>{enabled ? "ACTIVE" : "DISABLED"}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground">
                                AI Skipper automatically detects and skips videos identified as AI-generated based on your keywords and channel blocking list.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Detection Speed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                                    <span>Fast (500ms)</span>
                                    <span className="text-primary font-bold">{checkInterval}ms</span>
                                    <span>Slow (5000ms)</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="5000"
                                    step="500"
                                    value={checkInterval}
                                    onChange={(e) => saveCheckInterval(e.target.value)}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <p className="text-[10px] text-muted-foreground">Lower values skip faster but may increase CPU usage.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between text-sm">
                                <span>Skips today:</span>
                                <span className="font-mono">0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === "keywords" && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add keyword..."
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                            className="h-8"
                        />
                        <Button size="sm" onClick={addKeyword}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto align-start">
                        {keywords.map(k => (
                            <Badge key={k} variant="secondary" className="flex gap-1 items-center">
                                {k}
                                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => removeKeyword(k)} />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "channels" && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Channel name..."
                            value={newChannel}
                            onChange={(e) => setNewChannel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addChannel()}
                            className="h-8"
                        />
                        <Button size="sm" onClick={addChannel}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {channels.length === 0 && <p className="text-xs text-muted-foreground">No channels blocked yet.</p>}
                        {channels.map(c => (
                            <div key={c} className="flex justify-between items-center bg-secondary/50 p-2 rounded-md text-sm">
                                <span>{c}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeChannel(c)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "regex" && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Regex (e.g. \(AI .* Cover\))"
                            value={newRegex}
                            onChange={(e) => setNewRegex(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addRegex()}
                            className="h-8 font-mono text-xs"
                        />
                        <Button size="sm" onClick={addRegex}><Plus className="h-4 w-4" /></Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Case-insensitive matching against title & description.</p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {regexPatterns.length === 0 && <p className="text-xs text-muted-foreground">No regex patterns defined.</p>}
                        {regexPatterns.map(r => (
                            <div key={r} className="flex justify-between items-center bg-secondary/50 p-2 rounded-md text-sm font-mono break-all">
                                <span>{r}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => removeRegex(r)}>
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
