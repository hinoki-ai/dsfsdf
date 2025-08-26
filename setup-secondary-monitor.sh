#!/bin/bash

echo "🔍 SECONDARY MONITOR SETUP SCRIPT"
echo "=================================="

# Function to test monitor ports
test_monitor_port() {
    local port=$1
    local position=$2

    echo "Testing $port..."

    # Enable the port
    xrandr --output $port --auto --$position-of HDMI-A-0

    # Wait a moment for detection
    sleep 2

    # Check if monitor was detected
    if xrandr --listmonitors | grep -q $port; then
        echo "✅ SUCCESS: $port detected and configured!"
        echo "📺 Current monitor configuration:"
        xrandr --listmonitors
        return 0
    else
        echo "❌ $port not detected (monitor not connected or powered off)"
        # Turn off the port to clean up
        xrandr --output $port --off
        return 1
    fi
}

echo "Current monitors:"
xrandr --listmonitors
echo ""

# Test DisplayPort first (preferred for modern monitors)
echo "Testing DisplayPort..."
if test_monitor_port "DisplayPort-0" "right"; then
    echo "🎉 DisplayPort setup complete!"
    exit 0
fi

# Test DVI if DisplayPort failed
echo ""
echo "Testing DVI-D..."
if test_monitor_port "DVI-D-0" "right"; then
    echo "🎉 DVI-D setup complete!"
    exit 0
fi

echo ""
echo "❌ NO SECONDARY MONITOR DETECTED"
echo ""
echo "🔧 TROUBLESHOOTING STEPS:"
echo "1. Ensure secondary monitor is POWERED ON"
echo "2. Connect cable to DisplayPort OR DVI-D port"
echo "3. Try different cable if available"
echo "4. Check monitor input settings (press Input/Source button)"
echo "5. Re-run this script after connecting monitor"
echo ""
echo "Available commands:"
echo "- xrandr --auto (auto-detect all monitors)"
echo "- xrandr --output DisplayPort-0 --auto --right-of HDMI-A-0"
echo "- xrandr --output DVI-D-0 --auto --right-of HDMI-A-0"
echo ""
echo "For GUI setup: Settings → Displays"