#!/bin/bash
set -e
set -o pipefail

PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
FONT_RESET='\033[0m'

# Supported video extensions
VIDEO_EXTENSIONS=("mp4" "mkv" "webm" "avi" "mov" "flv" "ts" "mpg" "mpeg" "wmv")

command_exists() { command -v "$1" >/dev/null 2>&1; }

ffmpeg_check_install() {
    if command_exists ffmpeg; then
        echo -e "${GREEN}FFmpeg is already installed.${FONT_RESET}"
         if [ -x /usr/bin/ffmpeg ]; then
     FFMPEG_PATH="/usr/bin/ffmpeg"
 elif [ -x /usr/local/bin/ffmpeg ]; then
     FFMPEG_PATH="/usr/local/bin/ffmpeg"
 else
     FFMPEG_PATH=$(command -v ffmpeg)
 fi
        echo -e "${GREEN}Current FFmpeg version:${FONT_RESET}"
        "$FFMPEG_PATH" -version | head -n 1
        read -p "$(echo -e "${YELLOW}Skip FFmpeg installation/update? (yes/no, default: yes): ${FONT_RESET}")" skip_ffmpeg_install
        skip_ffmpeg_install=${skip_ffmpeg_install:-yes}
        if [[ "${skip_ffmpeg_install,,}" == "no" ]]; then
            install_latest_ffmpeg
        else
            echo -e "${GREEN}Skipping FFmpeg installation/update.${FONT_RESET}"
        fi
    else
        echo -e "${YELLOW}FFmpeg not found.${FONT_RESET}"
        install_latest_ffmpeg
    fi
}

install_latest_ffmpeg() {
    echo -e "${BLUE}Installing/updating FFmpeg (John Van Sickle static build)...${FONT_RESET}"
    echo -e "${YELLOW}This downloads a pre-compiled static build for best codec support.${FONT_RESET}"
    read -p "$(echo -e "${YELLOW}Proceed with download/install? (yes/no): ${FONT_RESET}")" confirm_install
    if [[ "${confirm_install,,}" != "yes" ]]; then
        echo -e "${RED}Aborted by user. The script may not work without FFmpeg.${FONT_RESET}"
        return 1
    fi
    local SUDO_CMD=""
    if command_exists sudo; then
        SUDO_CMD="sudo"
    elif [ "$(id -u)" -ne 0 ]; then
        echo -e "${RED}sudo not found and not root. Please install sudo or run as root.${FONT_RESET}"
        return 1
    fi
    $SUDO_CMD apt update
    $SUDO_CMD apt install -y wget tar xz-utils curl
    ARCH=$(uname -m)
    FFMPEG_STATIC_URL=""
    if [ "$ARCH" = "x86_64" ]; then
        FFMPEG_STATIC_URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
    elif [ "$ARCH" = "aarch64" ]; then
        FFMPEG_STATIC_URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz"
    else
        echo -e "${RED}Unsupported architecture: $ARCH. Install FFmpeg manually.${FONT_RESET}"
        return 1
    fi
    echo -e "${BLUE}Downloading FFmpeg from ${FFMPEG_STATIC_URL}...${FONT_RESET}"
    cd /tmp
    if wget -q --show-progress --progress=bar:force:noscroll -O ffmpeg-static.tar.xz "$FFMPEG_STATIC_URL"; then
        echo -e "${GREEN}Download complete. Extracting...${FONT_RESET}"
        rm -rf ffmpeg-*-static
        if tar -xf ffmpeg-static.tar.xz; then
            EXTRACTED_DIR=$(find . -maxdepth 1 -type d -name "ffmpeg-*-static" -print -quit)
            if [ -d "$EXTRACTED_DIR" ]; then
                echo -e "${GREEN}Moving ffmpeg and ffprobe to /usr/local/bin/...${FONT_RESET}"
                $SUDO_CMD mv "$EXTRACTED_DIR/ffmpeg" /usr/local/bin/
                $SUDO_CMD mv "$EXTRACTED_DIR/ffprobe" /usr/local/bin/
                $SUDO_CMD chmod +x /usr/local/bin/ffmpeg /usr/local/bin/ffprobe
                echo -e "${GREEN}FFmpeg installed/updated successfully!${FONT_RESET}"
                ffmpeg -version | head -n 1
            else
                echo -e "${RED}Extracted FFmpeg directory not found.${FONT_RESET}"; rm -f ffmpeg-static.tar.xz; return 1
            fi
            rm -rf "$EXTRACTED_DIR" ffmpeg-static.tar.xz; cd - > /dev/null
        else
            echo -e "${RED}Failed to extract FFmpeg archive.${FONT_RESET}"; rm -f ffmpeg-static.tar.xz; return 1
        fi
    else
        echo -e "${RED}Failed to download FFmpeg.${FONT_RESET}"; return 1
    fi
}

stream_start() {
    echo -e "${BLUE}Stream setup...${FONT_RESET}"
    local full_rtmp_url video_folder
    while true; do
        read -p "$(echo -e "${YELLOW}Enter full RTMP URL (e.g., rtmp://a.rtmp.youtube.com/live2/xxxx-xxxx): ${FONT_RESET}")" full_rtmp_url_raw
        # 去除前后空格、不可见字符
        full_rtmp_url=$(echo "$full_rtmp_url_raw" | tr -d '\r\n\t' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        # 基本校验
        if [[ "$full_rtmp_url" =~ ^rtmp(s)?://.+ ]]; then
            # 自动去除多余的重复斜杠（比如/xxxx//xxxx -> /xxxx/xxxx）
            full_rtmp_url=$(echo "$full_rtmp_url" | sed 's#//*#/#g;s#:/#://#')
            echo -e "${GREEN}RTMP URL: ${BLUE}${full_rtmp_url}${FONT_RESET}"
            break
        else
            echo -e "${RED}Invalid RTMP URL. Must start with 'rtmp://' or 'rtmps://'. Try again.${FONT_RESET}"
        fi
    done
    while true; do
        read -p "$(echo -e "${YELLOW}Enter video directory (absolute path, e.g., /opt/videos): ${FONT_RESET}")" video_folder
        if [ -d "$video_folder" ]; then
            echo -e "${GREEN}Video directory: $video_folder${FONT_RESET}"; break
        else
            echo -e "${RED}Directory not found: $video_folder. Try again.${FONT_RESET}"
        fi
    done
    echo -e "${BLUE}Starting infinite streaming loop. Press Ctrl+C to stop.${FONT_RESET}"
    while true; do
        echo -e "${GREEN}Searching and shuffling videos in '$video_folder'...${FONT_RESET}"
        local find_options_str=""
        for ext_idx in "${!VIDEO_EXTENSIONS[@]}"; do
            if [ "$ext_idx" -eq 0 ]; then
                find_options_str="-iname \"*.${VIDEO_EXTENSIONS[$ext_idx]}\""
            else
                find_options_str="$find_options_str -o -iname \"*.${VIDEO_EXTENSIONS[$ext_idx]}\""
            fi
        done
        mapfile -t video_files < <(eval "find \"$video_folder\" -type f \( $find_options_str \) -print0" | shuf -z | xargs -0 -r printf "%s\n")
        if [ ${#video_files[@]} -eq 0 ]; then
            echo -e "${RED}No video files found. Waiting 15s...${FONT_RESET}"; sleep 15; continue
        fi
        echo -e "${GREEN}Found ${#video_files[@]} video files. Starting playback cycle.${FONT_RESET}"
        for video_file in "${video_files[@]}"; do
            echo -e "${BLUE}--------------------------------------------------${FONT_RESET}"
            echo -e "${GREEN}Streaming: $video_file${FONT_RESET}"
            echo -e "${GREEN}RTMP: $full_rtmp_url${FONT_RESET}"
		ffmpeg -hide_banner \
		    -nostdin \
		    -analyzeduration 10M -probesize 10M \
		    -i "$video_file" -vf "scale=1280:720" -r 35 \
		    -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p \
		    -maxrate 4250k -bufsize 80000k -g 70 -keyint_min 70 -sc_threshold 0 \
		    -c:a aac -b:a 128k -ar 44100 \
		    -threads 0 \
		    -f flv "$full_rtmp_url" &
		pid=$!
		echo -e "${YELLOW}FFmpeg PID: $pid${FONT_RESET}"
		sleep 3
		ionice -c 2 -n 0 -p "$pid"
		renice -n -20 -p "$pid" >/dev/null
		wait "$pid"
            echo -e "${BLUE}---------------- FFmpeg ended --------------------${FONT_RESET}"
            sleep 0
        done
        echo -e "${YELLOW}Cycle complete. Re-shuffling and starting again...${FONT_RESET}"
        sleep 0
    done
}

stream_stop() {
    echo -e "${YELLOW}Stopping FFmpeg processes...${FONT_RESET}"
    local killed_processes=false
    if pgrep -f "ffmpeg -hide_banner -re -nostdin.*-f flv rtmp(s)?://" > /dev/null; then
        echo -e "${BLUE}Attempting graceful stop (SIGTERM)...${FONT_RESET}"
        pkill -SIGTERM -f "ffmpeg -hide_banner -re -nostdin.*-f flv rtmp(s)?://" && sleep 2
        if pgrep -f "ffmpeg -hide_banner -re -nostdin.*-f flv rtmp(s)?://" > /dev/null; then
            echo -e "${YELLOW}Forceful stop (SIGKILL)...${FONT_RESET}"
            pkill -SIGKILL -f "ffmpeg -hide_banner -re -nostdin.*-f flv rtmp(s)?://"
        fi
        echo -e "${GREEN}Targeted FFmpeg processes stopped.${FONT_RESET}"
        killed_processes=true
    fi
    if ! $killed_processes; then
        if pgrep ffmpeg > /dev/null; then
            echo -e "${YELLOW}No stream processes found. Trying 'killall ffmpeg'...${FONT_RESET}"
            if killall ffmpeg > /dev/null 2>&1; then
                echo -e "${GREEN}All FFmpeg processes stopped.${FONT_RESET}"
            else
                echo -e "${RED}killall ffmpeg failed or no processes found.${FONT_RESET}"
            fi
        else
            echo -e "${GREEN}No FFmpeg processes running.${FONT_RESET}"
        fi
    fi
    echo -e "${YELLOW}If using screen/tmux, manually terminate the session as well.${FONT_RESET}"
}

main_menu() {
    clear
    echo -e "${YELLOW}Ubuntu FFmpeg Unattended Loop Streamer (Clean NoLog Edition)${FONT_RESET}"
    echo -e "${RED}IMPORTANT: For long streams, run inside 'screen' or 'tmux'!${FONT_RESET}"
    echo -e "${GREEN}Example: screen -S stream_session bash $(basename "$0")${FONT_RESET}"
    echo -e "--------------------------------------------"
    echo -e "${BLUE}1. Check/Install/Update FFmpeg${FONT_RESET}"
    echo -e "${BLUE}2. Start Unattended Loop Streaming${FONT_RESET}"
    echo -e "${BLUE}3. Stop Streaming (kills FFmpeg processes)${FONT_RESET}"
    echo -e "${BLUE}4. Exit${FONT_RESET}"
    echo -e "--------------------------------------------"
    read -p "$(echo -e "${YELLOW}Enter your choice (1-4): ${FONT_RESET}")" choice
    case "$choice" in
        1) ffmpeg_check_install ;;
        2)
            if ! command_exists ffmpeg; then
                echo -e "${RED}FFmpeg not found. Install via option 1 first.${FONT_RESET}"
            else
                echo -e "${YELLOW}Starting stream. To stop, use Option 3 from this menu, or Ctrl+C if not in screen/tmux.${FONT_RESET}"
                stream_start
            fi
            ;;
        3) stream_stop ;;
        4) echo -e "${GREEN}Exiting.${FONT_RESET}"; exit 0 ;;
        *) echo -e "${RED}Invalid choice (1-4).${FONT_RESET}" ;;
    esac
    echo ""; read -p "Press Enter for main menu..."
    main_menu
}

main_menu