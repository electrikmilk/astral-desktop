<img width="256" height="256" alt="app_icon" src="https://github.com/user-attachments/assets/d54149c0-b8ef-48ef-9c7b-1a4c27344a53" />

# Astral

Project into machines via web browser 🪐

**📣 WIP**

It is built on a Vue/Laravel stack currently.

## Current Use Case

Astral is a web desktop designed for secure installation (which is currently at your discretion) on a VM or remote machine, accessible via a port that can be accessed on your local machine through a web UI in any installed web browser.

Eventually, I would like to tap into offline web APIs, but currently, it will ping the machine and display warnings or errors in the UI when a machine can no longer be reached or is not responding. It will then try to reconnect.

This is a successor to my prior web desktops, in an attempt to create a usable (but not overly fancy) remote machine web UI built specifically for this purpose.

I want to explore further how Astral could be useful beyond system status and terminal pass-through with PHP exec, which should work for both Windows and Unix-based systems, but for now, getting the current user, etc., is very *nix-based. I would also like to add a basic but useful file manager, and other simple but useful applications that allow you to perform actions on a file or preview it, all from one web UI.

## Security Warning

It is my understanding that a web desktop is a UI loaded into your web browser from your remote machine, which allows you to take various actions and, in some cases, directly pass through actions to your remote machine from this UI. This assumes you have put Astral behind a secure portal. Eventually, I would like to explore a preferred method that could be advised for use or a typical setup script, but for now, I don't personally know what is best for each platform. Obviously, especially if what is on the system or what it does is pertinent to something or someone, 

## Performance Warning

Currently, Astral has a background UI effect that randomly pops in and out of random colored blurred ellipses that randomly fluctuate their size, color, and blur. I am concerned this may have varied performance, especially as the system applications scale. So if this does give you any issues, know that I am planning to implement a way to toggle this on and off, as well as remember to keep it off or on when Astral starts.

## Current Usage

Astral is a remote reactive system by design. Its containers, UI elements, etc., are all designed to react to remote system events and transform as data to the remote changes.

It first tries to discover if it can connect to an Astral backend installed on the remote system, all verified by CSRF tokens.

<img width="1409" height="743" alt="Screenshot 2025-11-24 at 14 28 30" src="https://github.com/user-attachments/assets/5416d640-e459-4919-b767-cc55a148b8a4" />

Once it does, the UI reacts and changes the icon for the remote, displaying the status of the remote it has now received.

<img width="1407" height="741" alt="Screenshot 2025-11-24 at 14 28 11 1" src="https://github.com/user-attachments/assets/72d9f0c8-5250-4c8e-8e9b-c6faed309ecc" />

Astral has a beautiful, but also fluid UI design that changes in reaction to context. Astral is composed of views that consist of elements that can be modeled based on the value of a store, which holds information about the remote system, so reacting to the system not responding with OK, especially in the "Astral way", it is trivial to display the disconnected state or any other state change.

## Desktop

From there, we are greeted with the Astral Desktop, which currently only includes a system menu, clock, and app launcher.

<img width="1416" height="743" alt="Screenshot 2025-11-24 at 14 37 20" src="https://github.com/user-attachments/assets/3d0b12ba-dcb1-42cb-869d-a8d9e481719e" />

Currently, the system menu allows for exiting the desktop.

<img width="330" height="227" alt="Screenshot 2025-11-24 at 14 28 59" src="https://github.com/user-attachments/assets/f0da6696-e87b-492c-adf3-dbdfbb31a107" />

The terminal application shows how windowing would work:

<img width="1415" height="745" alt="Screenshot 2025-11-24 at 14 28 45" src="https://github.com/user-attachments/assets/a83c0ba9-c416-4061-97c8-c8f59046d317" />

The terminal application shows we have pass-through to the remote system, and applications can either have HTML or HTML canvas graphics for their application.

Running `ls`:

<img width="665" height="549" alt="Screenshot 2025-11-24 at 14 29 20" src="https://github.com/user-attachments/assets/0e4ac84f-ae26-4d17-b5e5-a966891c0a10" />
