require 'xcodeproj'

project_path = 'MoonSky.xcodeproj'
project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == 'MoonSky' }

bridging_header_path = 'MoonSky/MoonSky-Bridging-Header.h'
unless File.exist?(bridging_header_path)
  File.open(bridging_header_path, 'w') do |file|
    file.write("#import \"Orientation.h\"\n")
  end
end

target.build_configurations.each do |config|
  config.build_settings['SWIFT_OBJC_BRIDGING_HEADER'] = 'MoonSky/MoonSky-Bridging-Header.h'
end

project.save
puts "Bridging header added and project saved."
