<img width="256" height="256" alt="app_icon" src="https://github.com/user-attachments/assets/d54149c0-b8ef-48ef-9c7b-1a4c27344a53" />

# Astral

Astral is a web desktop built on top of Laravel with a fluid UI that allows you to project into a remote machine via a web browser.

<img alt="Astral Desktop" src="https://github.com/user-attachments/assets/a83c0ba9-c416-4061-97c8-c8f59046d317" />

Astral also shines beautifully in the dark.

<img alt="Astral Desktop Dark Mode" src="https://github.com/user-attachments/assets/1fa66f73-577c-4e24-b86e-b2c1eb973fc2" />

**📣 WIP 📣**

Everything you see here is subject to change, as I not only technically started this project a year or two ago, but there are many ways I would like to improve the project. I'm not sure if the desktop metaphor always works or is preferred either. It would also be nice if it were more responsive and could be used on a mobile web browser; basically, it should eventually be a PWA.

## Current Use Case

Astral is a web desktop designed for secure installation (which is currently at your discretion) on a VM or remote machine, accessible via a port that can be accessed on your local machine through a web UI in any installed web browser.

Eventually, I would like to tap into offline web APIs, but currently, it will ping the machine and display warnings or errors in the UI when a machine can no longer be reached or is not responding. It will then try to reconnect.

This is a successor to my prior web desktops, designed to create a usable (but not overly fancy) remote machine web UI specifically for this purpose.

I want to explore further how Astral could be useful beyond system status and terminal pass-through with PHP exec, which should work for both Windows and Unix-based systems, but for now, getting the current user, etc., is very *nix-based. I would also like to add a basic but useful file manager, and other simple but useful applications that allow you to perform actions on a file or preview it, all from one web UI.

## Sound Warning

Astral currently has a startup sound. It also has a terminal beeping sound. I will make both configurable to be able to turn them off in the future.

## Security Warning

It is my understanding that a web desktop is a UI loaded into your web browser from your remote machine, which allows you to take various actions and, in some cases, directly pass through actions to your remote machine from this UI. This assumes you have put Astral behind a secure portal. Eventually, I would like to explore a preferred method that could be advised for use or a typical setup script, but for now, I don't personally know what is best for each platform. Obviously, especially if what is on the system or what it does is pertinent to something or someone, ensure access to the UI is behind a secure login or other secure means of authentication.

## Performance Warning

Currently, Astral has a background UI effect that randomly pops in and out of random colored blurred ellipses that randomly fluctuate their size, color, and blur. I am concerned this may have varied performance, especially as the system applications scale. So if this does give you any issues, know that I am planning to implement a way to toggle this on and off, as well as remember to keep it off or on when Astral starts.

---

<img width="1742" height="1233" alt="Screenshot 2024-06-15 at 17 56 15" src="https://github.com/user-attachments/assets/ed4aad8d-a53d-4c5b-82b7-d3a2ce73c4c4" />

