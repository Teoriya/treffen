import { receiveUpdates, sendableUpdates, collab, getSyncedVersion } from "@codemirror/collab"
import { ViewPlugin } from "@codemirror/view"
import { ACTIONS } from "../../socket/actionsEditor"
import { ChangeSet } from "@codemirror/state"

export function peerExtension(startVersion, socket, roomId) {
    async function pushUpdates(version, updates) {
        const newUpdates = updates.map(u => ({
            clientID: u.clientID,
            changes: u.changes.toJSON()
        }))
        socket.emit(ACTIONS.PUSH, { version, newUpdates, roomId })
        // console.log("Push")
    }

    let plugin = ViewPlugin.fromClass(class {
        pushing = false
        done = false
        view;

        constructor(view) { this.view = view; this.pull(); }

        update(update) {
            if (update.docChanged) this.push();
        }

        async push() {
            let updates = sendableUpdates(this.view.state)
            if ( !updates.length) return
            this.pushing = true
            let version = getSyncedVersion(this.view.state)
            await pushUpdates(version, updates)
            this.pushing = false
            // Regardless of whether the push failed or new updates came in
            // while it was running, try again if there's updates remaining
            if (sendableUpdates(this.view.state).length)
              setTimeout(() => this.push(), 100)
        }

        async pull() {
            socket.on(ACTIONS.SYNC, ({ newVersion, updates }) => {
                let version = getSyncedVersion(this.view.state)
                if (newVersion > version) {
                    const newUpdates = updates.slice(version).map(u => ({
                        changes: ChangeSet.fromJSON(u.changes),
                        clientID: u.clientID
                    }))
                    // console.log(newUpdates.length,version,newVersion,"\n")
                    this.view.dispatch(receiveUpdates(this.view.state, newUpdates))
                    // console.log(getSyncedVersion(this.view.state))
                }
            })

        }

        destroy() { this.done = true }
    })
    // console.log(plugin)
    return [collab({ startVersion }), plugin]
}