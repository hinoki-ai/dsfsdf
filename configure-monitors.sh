#!/bin/bash

echo "🖥️  ADVANCED MONITOR CONFIGURATION"
echo "=================================="

show_help() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  auto          Auto-detect and configure all monitors"
    echo "  dual-right    Configure secondary monitor to the right"
    echo "  dual-left     Configure secondary monitor to the left"
    echo "  dual-above    Configure secondary monitor above primary"
    echo "  dual-below    Configure secondary monitor below primary"
    echo "  mirror        Mirror primary monitor on secondary"
    echo "  extend        Extend desktop across all monitors"
    echo "  single        Use only primary monitor (disable secondary)"
    echo "  status        Show current monitor status"
    echo "  test          Test all available ports"
    echo "  help          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 dual-right    # Secondary monitor on the right"
    echo "  $0 mirror        # Mirror primary display"
    echo "  $0 status        # Check current setup"
}

show_status() {
    echo "📊 CURRENT MONITOR STATUS:"
    echo "=========================="
    xrandr --listmonitors
    echo ""
    echo "🔌 AVAILABLE OUTPUTS:"
    xrandr | grep -E "(connected|disconnected)" | grep -v "Screen"
    echo ""
    echo "⚙️  PRIMARY MONITOR: HDMI-A-0 (1600x900)"
}

test_ports() {
    echo "🔍 TESTING ALL MONITOR PORTS:"
    echo "============================="

    local ports=("DisplayPort-0" "DVI-D-0")
    local found=0

    for port in "${ports[@]}"; do
        echo "Testing $port..."

        # Try to enable port
        xrandr --output $port --auto --right-of HDMI-A-0
        sleep 2

        if xrandr --listmonitors | grep -q $port; then
            echo "✅ $port: MONITOR DETECTED!"
            found=1
        else
            echo "❌ $port: No monitor detected"
            xrandr --output $port --off
        fi
    done

    if [ $found -eq 0 ]; then
        echo ""
        echo "❌ NO SECONDARY MONITORS FOUND"
        echo "Please ensure monitor is:"
        echo "  - Powered ON"
        echo "  - Connected to DisplayPort OR DVI-D port"
        echo "  - Set to correct input source"
    fi
}

configure_dual() {
    local position=$1
    local port=""

    # Find active secondary monitor
    if xrandr --listmonitors | grep -q "DisplayPort-0"; then
        port="DisplayPort-0"
    elif xrandr --listmonitors | grep -q "DVI-D-0"; then
        port="DVI-D-0"
    else
        echo "❌ No secondary monitor detected!"
        echo "Run '$0 test' first to find available monitors"
        return 1
    fi

    echo "🔧 Configuring $port as secondary monitor ($position)..."

    case $position in
        "right")
            xrandr --output $port --auto --right-of HDMI-A-0
            ;;
        "left")
            xrandr --output $port --auto --left-of HDMI-A-0
            ;;
        "above")
            xrandr --output $port --auto --above HDMI-A-0
            ;;
        "below")
            xrandr --output $port --auto --below HDMI-A-0
            ;;
        "mirror")
            xrandr --output $port --auto --same-as HDMI-A-0
            ;;
    esac

    echo "✅ Configuration complete!"
    show_status
}

case "${1:-status}" in
    "auto")
        echo "🔄 Auto-detecting monitors..."
        xrandr --auto
        sleep 2
        show_status
        ;;
    "dual-right")
        configure_dual "right"
        ;;
    "dual-left")
        configure_dual "left"
        ;;
    "dual-above")
        configure_dual "above"
        ;;
    "dual-below")
        configure_dual "below"
        ;;
    "mirror")
        configure_dual "mirror"
        ;;
    "extend")
        echo "🔧 Extending desktop across all monitors..."
        xrandr --auto
        sleep 2
        show_status
        ;;
    "single")
        echo "🔧 Disabling secondary monitors (single display mode)..."
        xrandr --output HDMI-A-0 --auto --primary
        xrandr --output DisplayPort-0 --off
        xrandr --output DVI-D-0 --off
        show_status
        ;;
    "test")
        test_ports
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac