// joeshakely
using System;
using Microsoft.AspNetCore.Components;

namespace BlazorMonaco;

public partial class MonacoDiffEditor
{
    [Parameter] public Func<MonacoDiffEditor, StandaloneDiffEditorConstructionOptions> ConstructionOptions { get; set; }
    [Parameter] public EventCallback<MonacoDiffEditor> OnDidUpdateDiff { get; set; }

    // Events for the original editor (left)
    [Parameter] public EventCallback<MonacoEditor> OnDidCompositionEndOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidCompositionStartOriginal { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnContextMenuOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidBlurEditorTextOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidBlurEditorWidgetOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidChangeConfigurationOriginal { get; set; }
    [Parameter] public EventCallback<CursorPositionChangedEvent> OnDidChangeCursorPositionOriginal { get; set; }
    [Parameter] public EventCallback<CursorSelectionChangedEvent> OnDidChangeCursorSelectionOriginal { get; set; }
    [Parameter] public EventCallback<ModelChangedEvent> OnDidChangeModelOriginal { get; set; }
    [Parameter] public EventCallback<ModelContentChangedEvent> OnDidChangeModelContentOriginal { get; set; }
    [Parameter] public EventCallback<ModelDecorationsChangedEvent> OnDidChangeModelDecorationsOriginal { get; set; }
    [Parameter] public EventCallback<ModelLanguageChangedEvent> OnDidChangeModelLanguageOriginal { get; set; }
    [Parameter] public EventCallback<ModelLanguageConfigurationChangedEvent> OnDidChangeModelLanguageConfigurationOriginal { get; set; }
    [Parameter] public EventCallback<ModelOptionsChangedEvent> OnDidChangeModelOptionsOriginal { get; set; }
    [Parameter] public EventCallback<ContentSizeChangedEvent> OnDidContentSizeChangeOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditorBase> OnDidDisposeOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidFocusEditorTextOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidFocusEditorWidgetOriginal { get; set; }
    [Parameter] public EventCallback<MonacoEditorBase> OnDidInitOriginal { get; set; }
    [Parameter] public EventCallback<EditorLayoutInfo> OnDidLayoutChangeOriginal { get; set; }
    [Parameter] public EventCallback<PasteEvent> OnDidPasteOriginal { get; set; }
    [Parameter] public EventCallback<ScrollEvent> OnDidScrollChangeOriginal { get; set; }
    [Parameter] public EventCallback<KeyboardEvent> OnKeyDownOriginal { get; set; }
    [Parameter] public EventCallback<KeyboardEvent> OnKeyUpOriginal { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseDownOriginal { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseLeaveOriginal { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseMoveOriginal { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseUpOriginal { get; set; }

    // Events for the modified editor (right)
    [Parameter] public EventCallback<MonacoEditor> OnDidCompositionEndModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidCompositionStartModified { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnContextMenuModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidBlurEditorTextModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidBlurEditorWidgetModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidChangeConfigurationModified { get; set; }
    [Parameter] public EventCallback<CursorPositionChangedEvent> OnDidChangeCursorPositionModified { get; set; }
    [Parameter] public EventCallback<CursorSelectionChangedEvent> OnDidChangeCursorSelectionModified { get; set; }
    [Parameter] public EventCallback<ModelChangedEvent> OnDidChangeModelModified { get; set; }
    [Parameter] public EventCallback<ModelContentChangedEvent> OnDidChangeModelContentModified { get; set; }
    [Parameter] public EventCallback<ModelDecorationsChangedEvent> OnDidChangeModelDecorationsModified { get; set; }
    [Parameter] public EventCallback<ModelLanguageChangedEvent> OnDidChangeModelLanguageModified { get; set; }
    [Parameter] public EventCallback<ModelLanguageConfigurationChangedEvent> OnDidChangeModelLanguageConfigurationModified { get; set; }
    [Parameter] public EventCallback<ModelOptionsChangedEvent> OnDidChangeModelOptionsModified { get; set; }
    [Parameter] public EventCallback<ContentSizeChangedEvent> OnDidContentSizeChangeModified { get; set; }
    [Parameter] public EventCallback<MonacoEditorBase> OnDidDisposeModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidFocusEditorTextModified { get; set; }
    [Parameter] public EventCallback<MonacoEditor> OnDidFocusEditorWidgetModified { get; set; }
    [Parameter] public EventCallback<MonacoEditorBase> OnDidInitModified { get; set; }
    [Parameter] public EventCallback<EditorLayoutInfo> OnDidLayoutChangeModified { get; set; }
    [Parameter] public EventCallback<PasteEvent> OnDidPasteModified { get; set; }
    [Parameter] public EventCallback<ScrollEvent> OnDidScrollChangeModified { get; set; }
    [Parameter] public EventCallback<KeyboardEvent> OnKeyDownModified { get; set; }
    [Parameter] public EventCallback<KeyboardEvent> OnKeyUpModified { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseDownModified { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseLeaveModified { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseMoveModified { get; set; }
    [Parameter] public EventCallback<EditorMouseEvent> OnMouseUpModified { get; set; }

    public MonacoEditor OriginalEditor { get; set; }
    public MonacoEditor ModifiedEditor { get; set; }
}

