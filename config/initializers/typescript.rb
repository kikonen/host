# Its defaults are `--target ES5 --noImplicitAny`.
if defined?(Typescript)
Typescript::Rails::Compiler.default_options = [
  '--target', 'ES6',
#  '--noImplicitAny',
  '--isolatedModules',
  '--noResolve',
  '--module', 'system',
  ]
end

#
# HACK KI
# tsc output logic changed apparently
#
module TypeScript
  module Node
    class << self
      # Compile TypeScript source file.
      # @param [String] source_file TypeScript source file
      # @return [TypeScript::Node::CompileResult] compile result
      def compile_file(source_file, *tsc_options)
        Dir.mktmpdir do |output_dir|
#          output_file = File.join(output_dir, 'out.js')
#          stdout, stderr, exit_status = tsc(*tsc_options, '--out', output_file, source_file)
          output_file = source_file.sub(/\.ts\z/, '.js')
          stdout, stderr, exit_status = tsc(*tsc_options, source_file)

          stdout = ''
          exit_status = 0 unless stdout.length > 0

          output_js = File.exist?(output_file) ? File.read(output_file) : nil
          CompileResult.new(
              output_js,
              exit_status,
              stdout,
              stderr,
          )
        end
      end
    end
  end
end
