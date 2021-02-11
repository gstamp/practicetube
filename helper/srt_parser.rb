require 'bundler/inline'

gemfile do
  source 'https://rubygems.org'
  gem 'srt'
  gem 'pry'
end

file = SRT::File.parse(File.new("persona5royal.srt"))
file.lines.each do |line|
  puts "[#{line.start_time},#{line.end_time},\"#{line.text.join(" ")}\"],"
end